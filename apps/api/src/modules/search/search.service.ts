import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'typesense';
import { Listing } from '../../entities/listing.entity';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: Client;

  constructor(@InjectRepository(Listing) private listingRepo: Repository<Listing>) {
    this.client = new Client({
      nodes: [{
        host: process.env.TYPESENSE_HOST || 'localhost',
        port: parseInt(process.env.TYPESENSE_PORT) || 8108,
        protocol: process.env.TYPESENSE_PROTOCOL || 'http',
      }],
      apiKey: process.env.TYPESENSE_API_KEY || 'xyz',
      connectionTimeoutSeconds: 2
    });
  }

  async onModuleInit() {
    try {
      const exists = await this.client.collections('listings').retrieve().catch(() => null);
      if (!exists) {
        await this.client.collections().create({
          name: 'listings',
          fields: [
            { name: 'id', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'price', type: 'float' },
            { name: 'categoryId', type: 'string', facet: true },
            { name: 'condition', type: 'string', facet: true },
            { name: 'location', type: 'geopoint', optional: true }
          ]
        });
      }
    } catch (e) {
      console.error('Typesense init error', e);
    }
  }

  async indexListing(listing: any) {
    const doc = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      categoryId: listing.categoryId,
      condition: listing.condition,
    };
    if (listing.location) {
      doc['location'] = [listing.location.coordinates[1], listing.location.coordinates[0]];
    }
    await this.client.collections('listings').documents().upsert(doc);
  }

  async search(query: any) {
    const searchReq: any = {
      q: query.q || '*',
      query_by: 'title,description',
      page: query.page || 1,
      per_page: query.limit || 10
    };

    let filters = [];
    if (query.category) filters.push(`categoryId:=${query.category}`);
    if (query.minPrice) filters.push(`price:>=${query.minPrice}`);
    if (query.maxPrice) filters.push(`price:<=${query.maxPrice}`);
    if (query.condition) filters.push(`condition:=${query.condition}`);
    
    if (query.lat && query.lng && query.radius) {
      filters.push(`location:(${query.lat}, ${query.lng}, ${query.radius} km)`);
    }

    if (filters.length > 0) {
      searchReq.filter_by = filters.join(' && ');
    }

    if (query.sort) {
      searchReq.sort_by = query.sort;
    }

    return this.client.collections('listings').documents().search(searchReq);
  }
}