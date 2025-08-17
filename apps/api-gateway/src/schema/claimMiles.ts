export const ClaimMilesManualSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: true,
    },
    message: {
      type: 'string',
      example: 'Manual request created successfully',
    },
    data: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Manual request id',
          example: 'fa14c3a0-d87a-4260-8e65-4b554fdf3eaf',
        },
        request_type: {
          type: 'string',
          description: 'Type of request',
          example: 'purchase',
        },
        status: {
          type: 'string',
          description: 'Status of the request',
          example: 'processing',
        },
        points: {
          type: 'number',
          description: 'Points amount',
          example: 10000,
        },
        discount: {
          type: 'number',
          description: 'Discount amount',
          example: 0,
        },
        description: {
          type: 'string',
          description: 'Request description',
          example: 'Test 2',
        },
        reason: {
          type: 'string',
          description: 'Request reason',
          example: '',
        },
        file_name: {
          type: 'string',
          description: 'Uploaded file name',
          example: '',
        },
        file_url: {
          type: 'string',
          description: 'Uploaded file URL',
          example: '1',
        },
        uploaded_at: {
          type: 'string',
          format: 'date-time',
          description: 'File upload timestamp',
          example: '2025-08-17T09:23:22.496Z',
        },
        processed_at: {
          type: 'string',
          format: 'date-time',
          description: 'Request processing timestamp',
          example: '2025-08-17T09:23:22.496Z',
        },
        seat_code: {
          type: 'string',
          description: 'Flight seat code',
          example: '36B',
        },
        seat_class: {
          type: 'string',
          description: 'Flight seat class',
          example: 'business',
        },
        ticket_number: {
          type: 'string',
          description: 'Flight ticket number',
          example: '7385927102340',
        },
        flight_code: {
          type: 'string',
          description: 'Flight code',
          example: 'VN1753',
        },
        flight_departure_airport: {
          type: 'string',
          description: 'Departure airport code',
          example: 'DAD',
        },
        flight_arrival_airport: {
          type: 'string',
          description: 'Arrival airport code',
          example: 'PXU',
        },
        flight_departure_date: {
          type: 'string',
          format: 'date-time',
          description: 'Flight departure timestamp',
          example: '2025-08-18T17:00:00.000Z',
        },
        flight_arrival_date: {
          type: 'string',
          format: 'date-time',
          description: 'Flight arrival timestamp',
          example: '2025-08-19T17:00:00.000Z',
        },
        distance: {
          type: 'number',
          description: 'Flight distance in kilometers',
          example: 1067,
        },
        flight_duration: {
          type: 'number',
          description: 'Flight duration in minutes',
          example: 0,
        },
        flight_airline: {
          type: 'string',
          description: 'Airline code',
          example: 'VN1753',
        },
        request_number: {
          type: 'string',
          description: 'Request reference number',
          example: 'REQ-1755422602496',
        },
      },
    },
  },
};
