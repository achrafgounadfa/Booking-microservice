import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { CreateEventDto, UpdateEventDto } from '../../../shared/dto/event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // Endpoints pour les événements
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    try {
      const event = await this.eventService.createEvent(createEventDto);
      return {
        success: true,
        message: 'Événement créé avec succès',
        event,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async getAllEvents(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('startDate') startDate?: string,
  ) {
    try {
      const startDateObj = startDate ? new Date(startDate) : undefined;
      const result = await this.eventService.getAllEvents(
        +page,
        +limit,
        category,
        city,
        startDateObj,
      );
      return {
        success: true,
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async getEventById(@Param('id') id: string) {
    try {
      const event = await this.eventService.getEventById(id);
      return {
        success: true,
        event,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  async updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    try {
      const event = await this.eventService.updateEvent(id, updateEventDto);
      return {
        success: true,
        message: 'Événement mis à jour avec succès',
        event,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    try {
      const result = await this.eventService.deleteEvent(id);
      return {
        success: result,
        message: result ? 'Événement supprimé ou annulé avec succès' : 'Événement non trouvé',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/tickets/:ticketTypeId')
  async updateTicketAvailability(
    @Param('id') id: string,
    @Param('ticketTypeId') ticketTypeId: string,
    @Body() data: { quantity: number },
  ) {
    try {
      const event = await this.eventService.updateTicketAvailability(
        id,
        ticketTypeId,
        data.quantity,
      );
      return {
        success: true,
        message: 'Disponibilité des billets mise à jour avec succès',
        event,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Endpoints pour les lieux
  @Post('venues')
  async createVenue(@Body() venueData: any) {
    try {
      const venue = await this.eventService.createVenue(venueData);
      return {
        success: true,
        message: 'Lieu créé avec succès',
        venue,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('venues')
  async getAllVenues(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const result = await this.eventService.getAllVenues(+page, +limit);
      return {
        success: true,
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('venues/:id')
  async getVenueById(@Param('id') id: string) {
    try {
      const venue = await this.eventService.getVenueById(id);
      return {
        success: true,
        venue,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put('venues/:id')
  async updateVenue(@Param('id') id: string, @Body() venueData: any) {
    try {
      const venue = await this.eventService.updateVenue(id, venueData);
      return {
        success: true,
        message: 'Lieu mis à jour avec succès',
        venue,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('venues/:id')
  async deleteVenue(@Param('id') id: string) {
    try {
      const result = await this.eventService.deleteVenue(id);
      return {
        success: result,
        message: result ? 'Lieu supprimé avec succès' : 'Lieu non trouvé',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Endpoints pour les catégories
  @Post('categories')
  async createCategory(@Body() categoryData: any) {
    try {
      const category = await this.eventService.createCategory(categoryData);
      return {
        success: true,
        message: 'Catégorie créée avec succès',
        category,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('categories')
  async getAllCategories() {
    try {
      const categories = await this.eventService.getAllCategories();
      return {
        success: true,
        categories,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('categories/:id')
  async getCategoryById(@Param('id') id: string) {
    try {
      const category = await this.eventService.getCategoryById(id);
      return {
        success: true,
        category,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() categoryData: any) {
    try {
      const category = await this.eventService.updateCategory(id, categoryData);
      return {
        success: true,
        message: 'Catégorie mise à jour avec succès',
        category,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    try {
      const result = await this.eventService.deleteCategory(id);
      return {
        success: result,
        message: result ? 'Catégorie supprimée avec succès' : 'Catégorie non trouvée',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
