export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Capibarismo Survey Extractor API',
    version: '1.0.0',
    description: 'Extract structured survey data from IPSOS PDFs using AI'
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        description: 'Authorization token (set via AUTH_TOKEN environment variable)'
      }
    }
  },
  paths: {
    '/api/surveys': {
      get: {
        summary: 'List all surveys',
        description: 'Retrieve a paginated list of all processed surveys',
        parameters: [
          {
            name: 'page',
            in: 'query',
            required: false,
            description: 'Page number (default: 1)',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
              example: 1
            }
          },
          {
            name: 'pageSize',
            in: 'query',
            required: false,
            description: 'Number of items per page (default: 10, max: 100)',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
              example: 10
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            format: 'uuid',
                            example: '550e8400-e29b-41d4-a716-446655440000'
                          },
                          source: {
                            type: 'string',
                            example: 'ipsos'
                          },
                          sourceUrl: {
                            type: 'string',
                            format: 'uri',
                            example: 'https://example.com/survey.pdf'
                          },
                          data: {
                            type: 'object',
                            description: 'Structured survey data'
                          },
                          createdAt: {
                            type: 'string',
                            format: 'date-time'
                          },
                          updatedAt: {
                            type: 'string',
                            format: 'date-time'
                          }
                        }
                      }
                    },
                    total: {
                      type: 'integer',
                      description: 'Total number of surveys',
                      example: 42
                    },
                    page: {
                      type: 'integer',
                      description: 'Current page number',
                      example: 1
                    },
                    pageSize: {
                      type: 'integer',
                      description: 'Number of items per page',
                      example: 10
                    },
                    totalPages: {
                      type: 'integer',
                      description: 'Total number of pages',
                      example: 5
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    error: {
                      type: 'string',
                      example: 'page must be greater than 0'
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    error: {
                      type: 'string',
                      example: 'Error message'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/surveys/{source}/process': {
      post: {
        summary: 'Extract survey data from PDF',
        description: 'Extracts structured survey data from election polls using Mistral OCR and OpenAI',
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'source',
            in: 'path',
            required: true,
            description: 'Survey source (ipsos, datum, or cpi)',
            schema: {
              type: 'string',
              enum: ['ipsos', 'datum', 'cpi']
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['pdfUrl'],
                properties: {
                  pdfUrl: {
                    type: 'string',
                    format: 'uri',
                    description: 'URL to the PDF file to process',
                    example: 'https://example.com/survey.pdf'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Extraction successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    message: {
                      type: 'string',
                      example: 'Survey data extracted successfully'
                    },
                    survey: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          format: 'uuid',
                          example: '550e8400-e29b-41d4-a716-446655440000'
                        },
                        source: {
                          type: 'string',
                          example: 'ipsos'
                        },
                        sourceUrl: {
                          type: 'string',
                          format: 'uri',
                          example: 'https://example.com/survey.pdf'
                        },
                        content: {
                          type: 'string',
                          description: 'Extracted text from PDF'
                        },
                        data: {
                          type: 'object',
                          description: 'Structured survey data'
                        },
                        createdAt: {
                          type: 'string',
                          format: 'date-time'
                        },
                        updatedAt: {
                          type: 'string',
                          format: 'date-time'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    error: {
                      type: 'string',
                      example: 'pdfUrl is required in request body'
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Missing authorization header',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    error: {
                      type: 'string',
                      example: 'Authorization header is required'
                    }
                  }
                }
              }
            }
          },
          '403': {
            description: 'Forbidden - Invalid authorization token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    error: {
                      type: 'string',
                      example: 'Invalid authorization token'
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Extraction failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: false
                    },
                    error: {
                      type: 'string',
                      example: 'Error message'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/health': {
      get: {
        summary: 'Health check',
        description: 'Check if the service is running',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok'
                    },
                    service: {
                      type: 'string',
                      example: 'capibarismo-survey-extractor'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                      example: '2026-02-28T12:00:00.000Z'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
