import { PrismaClient } from '@prisma/client'
import { logger } from '@/utils/logger'
import { config } from '@/utils/config'

export interface SearchQuery {
  q: string
  filters?: Record<string, any>
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
  include?: string[]
  exclude?: string[]
}

export interface SearchResult<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
  query: string
  filters?: Record<string, any>
  executionTime: number
}

export interface SearchIndex {
  id: string
  name: string
  table: string
  fields: string[]
  weight: number
  enabled: boolean
}

export interface SearchAnalytics {
  totalSearches: number
  popularQueries: Array<{ query: string; count: number }>
  searchTrends: Array<{ date: string; count: number }>
  averageResults: number
  zeroResultQueries: number
}

export class SearchEngine {
  private static instance: SearchEngine
  private prisma: PrismaClient
  private indexes: Map<string, SearchIndex> = new Map()
  private isInitialized: boolean = false

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  static getInstance(prisma?: PrismaClient): SearchEngine {
    if (!SearchEngine.instance && prisma) {
      SearchEngine.instance = new SearchEngine(prisma)
    }
    return SearchEngine.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    // Register default search indexes
    await this.registerDefaultIndexes()
    this.isInitialized = true
    logger.info('Search engine initialized')
  }

  private async registerDefaultIndexes(): Promise<void> {
    const defaultIndexes: SearchIndex[] = [
      {
        id: 'users',
        name: 'Users',
        table: 'users',
        fields: ['name', 'email', 'phone'],
        weight: 1.0,
        enabled: true
      },
      {
        id: 'companies',
        name: 'Companies',
        table: 'companies',
        fields: ['name', 'code', 'description'],
        weight: 1.0,
        enabled: true
      },
      {
        id: 'partners',
        name: 'Partners',
        table: 'partners',
        fields: ['name', 'code', 'email', 'phone', 'address', 'city', 'state', 'country'],
        weight: 1.0,
        enabled: true
      }
    ]

    for (const index of defaultIndexes) {
      this.indexes.set(index.id, index)
    }
  }

  async search<T = any>(query: SearchQuery): Promise<SearchResult<T>> {
    const startTime = Date.now()

    try {
      // Parse search query
      const searchTerms = this.parseSearchQuery(query.q)
      
      // Build search conditions
      const whereConditions = this.buildSearchConditions(searchTerms, query.filters)
      
      // Determine which tables to search
      const searchTables = this.getSearchTables(query.include, query.exclude)
      
      const results: T[] = []
      let total = 0

      // Search each enabled index
      for (const [indexId, index] of this.indexes) {
        if (!index.enabled || !searchTables.includes(indexId)) {
          continue
        }

        const tableResults = await this.searchTable(index, searchTerms, whereConditions, query)
        results.push(...tableResults.data)
        total += tableResults.total
      }

      // Sort and paginate results
      const sortedResults = this.sortResults(results, query.sort, query.order)
      const paginatedResults = this.paginateResults(sortedResults, query.page, query.limit)

      // Log search analytics
      await this.logSearchAnalytics(query.q, total, Date.now() - startTime)

      return {
        data: paginatedResults,
        total,
        page: query.page || 1,
        limit: query.limit || 20,
        pages: Math.ceil(total / (query.limit || 20)),
        query: query.q,
        filters: query.filters,
        executionTime: Date.now() - startTime
      }
    } catch (error) {
      logger.error('Search error:', error)
      throw error
    }
  }

  private parseSearchQuery(query: string): string[] {
    // Remove special characters and split into terms
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 0)
  }

  private buildSearchConditions(searchTerms: string[], filters?: Record<string, any>): any {
    const conditions: any = {}

    // Add search terms
    if (searchTerms.length > 0) {
      conditions.OR = searchTerms.map(term => ({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
          { code: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } }
        ]
      }))
    }

    // Add filters
    if (filters) {
      Object.assign(conditions, filters)
    }

    return conditions
  }

  private getSearchTables(include?: string[], exclude?: string[]): string[] {
    const allTables = Array.from(this.indexes.keys())
    
    if (include && include.length > 0) {
      return allTables.filter(table => include.includes(table))
    }
    
    if (exclude && exclude.length > 0) {
      return allTables.filter(table => !exclude.includes(table))
    }
    
    return allTables
  }

  private async searchTable(
    index: SearchIndex,
    searchTerms: string[],
    whereConditions: any,
    query: SearchQuery
  ): Promise<{ data: any[]; total: number }> {
    const tableName = index.table as keyof PrismaClient
    const model = this.prisma[tableName] as any

    if (!model) {
      logger.warn(`Model not found for table: ${tableName}`)
      return { data: [], total: 0 }
    }

    try {
      // Build search conditions for this specific table
      const tableConditions = this.buildTableSearchConditions(index, searchTerms, whereConditions)

      // Get total count
      const total = await model.count({
        where: tableConditions
      })

      // Get paginated results
      const data = await model.findMany({
        where: tableConditions,
        skip: ((query.page || 1) - 1) * (query.limit || 20),
        take: query.limit || 20,
        orderBy: this.buildOrderBy(query.sort, query.order)
      })

      // Add search metadata
      const resultsWithMetadata = data.map(item => ({
        ...item,
        _searchMetadata: {
          index: index.name,
          relevance: this.calculateRelevance(item, searchTerms, index)
        }
      }))

      return { data: resultsWithMetadata, total }
    } catch (error) {
      logger.error(`Error searching table ${tableName}:`, error)
      return { data: [], total: 0 }
    }
  }

  private buildTableSearchConditions(
    index: SearchIndex,
    searchTerms: string[],
    baseConditions: any
  ): any {
    const conditions = { ...baseConditions }

    if (searchTerms.length > 0) {
      const searchConditions = searchTerms.map(term => {
        const fieldConditions = index.fields.map(field => ({
          [field]: { contains: term, mode: 'insensitive' }
        }))
        return { OR: fieldConditions }
      })

      conditions.OR = searchConditions
    }

    return conditions
  }

  private buildOrderBy(sort?: string, order?: 'asc' | 'desc'): any {
    if (!sort) {
      return { createdAt: 'desc' }
    }

    return {
      [sort]: order || 'desc'
    }
  }

  private calculateRelevance(item: any, searchTerms: string[], index: SearchIndex): number {
    let relevance = 0

    for (const term of searchTerms) {
      for (const field of index.fields) {
        const fieldValue = item[field]
        if (fieldValue) {
          const value = String(fieldValue).toLowerCase()
          if (value.includes(term)) {
            relevance += index.weight
            if (value.startsWith(term)) {
              relevance += index.weight * 0.5 // Bonus for prefix match
            }
          }
        }
      }
    }

    return relevance
  }

  private sortResults(results: any[], sort?: string, order?: 'asc' | 'desc'): any[] {
    if (!sort) {
      // Sort by relevance if no specific sort is provided
      return results.sort((a, b) => {
        const relevanceA = a._searchMetadata?.relevance || 0
        const relevanceB = b._searchMetadata?.relevance || 0
        return relevanceB - relevanceA
      })
    }

    return results.sort((a, b) => {
      const valueA = a[sort]
      const valueB = b[sort]

      if (valueA < valueB) return order === 'asc' ? -1 : 1
      if (valueA > valueB) return order === 'asc' ? 1 : -1
      return 0
    })
  }

  private paginateResults(results: any[], page?: number, limit?: number): any[] {
    const pageNum = page || 1
    const limitNum = limit || 20
    const startIndex = (pageNum - 1) * limitNum
    const endIndex = startIndex + limitNum

    return results.slice(startIndex, endIndex)
  }

  private async logSearchAnalytics(query: string, resultCount: number, executionTime: number): Promise<void> {
    try {
      await this.prisma.searchLog.create({
        data: {
          query,
          resultCount,
          executionTime,
          timestamp: new Date()
        }
      })
    } catch (error) {
      logger.error('Failed to log search analytics:', error)
    }
  }

  // Index management
  async registerIndex(index: SearchIndex): Promise<void> {
    this.indexes.set(index.id, index)
    logger.info(`Registered search index: ${index.name}`)
  }

  async unregisterIndex(indexId: string): Promise<void> {
    this.indexes.delete(indexId)
    logger.info(`Unregistered search index: ${indexId}`)
  }

  async updateIndex(indexId: string, updates: Partial<SearchIndex>): Promise<void> {
    const index = this.indexes.get(indexId)
    if (!index) {
      throw new Error(`Index ${indexId} not found`)
    }

    Object.assign(index, updates)
    logger.info(`Updated search index: ${indexId}`)
  }

  getIndexes(): SearchIndex[] {
    return Array.from(this.indexes.values())
  }

  getIndex(indexId: string): SearchIndex | null {
    return this.indexes.get(indexId) || null
  }

  // Search analytics
  async getSearchAnalytics(days: number = 30): Promise<SearchAnalytics> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const totalSearches = await this.prisma.searchLog.count({
      where: {
        timestamp: {
          gte: startDate
        }
      }
    })

    const popularQueries = await this.prisma.searchLog.groupBy({
      by: ['query'],
      where: {
        timestamp: {
          gte: startDate
        }
      },
      _count: {
        query: true
      },
      orderBy: {
        _count: {
          query: 'desc'
        }
      },
      take: 10
    })

    const searchTrends = await this.prisma.searchLog.groupBy({
      by: ['timestamp'],
      where: {
        timestamp: {
          gte: startDate
        }
      },
      _count: {
        timestamp: true
      },
      orderBy: {
        timestamp: 'asc'
      }
    })

    const averageResults = await this.prisma.searchLog.aggregate({
      where: {
        timestamp: {
          gte: startDate
        }
      },
      _avg: {
        resultCount: true
      }
    })

    const zeroResultQueries = await this.prisma.searchLog.count({
      where: {
        timestamp: {
          gte: startDate
        },
        resultCount: 0
      }
    })

    return {
      totalSearches,
      popularQueries: popularQueries.map(q => ({
        query: q.query,
        count: q._count.query
      })),
      searchTrends: searchTrends.map(t => ({
        date: t.timestamp.toISOString().split('T')[0],
        count: t._count.timestamp
      })),
      averageResults: averageResults._avg.resultCount || 0,
      zeroResultQueries
    }
  }

  // Advanced search features
  async searchWithSuggestions(query: string): Promise<{
    results: any[]
    suggestions: string[]
  }> {
    const searchResult = await this.search({ q: query })
    
    // Generate suggestions based on popular queries
    const suggestions = await this.generateSuggestions(query)
    
    return {
      results: searchResult.data,
      suggestions
    }
  }

  private async generateSuggestions(query: string): Promise<string[]> {
    const suggestions: string[] = []
    
    // Get popular queries that contain the search term
    const popularQueries = await this.prisma.searchLog.groupBy({
      by: ['query'],
      where: {
        query: {
          contains: query,
          mode: 'insensitive'
        }
      },
      _count: {
        query: true
      },
      orderBy: {
        _count: {
          query: 'desc'
        }
      },
      take: 5
    })

    for (const popular of popularQueries) {
      if (popular.query !== query) {
        suggestions.push(popular.query)
      }
    }

    return suggestions
  }

  async searchWithFilters(
    query: string,
    filters: Record<string, any>
  ): Promise<SearchResult> {
    return this.search({
      q: query,
      filters,
      page: 1,
      limit: 20
    })
  }

  async searchByType(
    query: string,
    type: string
  ): Promise<SearchResult> {
    return this.search({
      q: query,
      include: [type],
      page: 1,
      limit: 20
    })
  }
} 