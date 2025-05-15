# LoopStore - Upcycled Clothing E-commerce Platform

Modern e-commerce platform for upcycled clothing built with Next.js and Django.

## Features

- Product catalog with search and filtering
- Shopping cart with Context API
- Multi-step checkout process
- Order management and tracking
- User account section
  - Order history with status tracking
  - Delivery details management
- Responsive design with Tailwind CSS
- Form validation with Zod
- Data persistence with localStorage

## Tech Stack

### Frontend

- Next.js
- React with TypeScript
- Tailwind CSS
- Zod for form validation
- Context API for state management

### Backend

- Django 5.2
- Django REST Framework
- PostgreSQL
- Docker

## Project Structure

```bash
loopstore/
├── backend/
│   ├── backend/           # Django project configuration
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── media/            # Media files storage
│   │   └── products/     # Product images
│   ├── shop/             # Main Django app
│   │   ├── migrations/
│   │   ├── tests/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   └── views.py
│   ├── docker-compose.yml # Docker configuration
│   ├── Dockerfile        # Docker build file
│   ├── manage.py
│   └── requirements.txt
├── frontend/            # Next.js frontend (dev environment)
│   ├── components/
│   │   └── account/     # Account related components
│   └── pages/
│       └── account/     # Account related pages
└── README.md
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- Docker and Docker Compose (for backend)
- PostgreSQL (if running backend locally)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/loopstore.git
cd loopstore
```

2.Set up the backend:

```bash
cd backend
# Copy environment variables
cp .env.example .env
# Edit .env with your settings

# Using Docker (recommended)
docker-compose up --build

# Or locally
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3.Set up the frontend (development environment):

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)

```env
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

DB_NAME=loopstore_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=db
DB_PORT=5432
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## API Endpoints

### Products

- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/` - Create new product (admin only)
- `PUT /api/products/{id}/` - Update product (admin only)
- `DELETE /api/products/{id}/` - Delete product (admin only)

### Orders

- `POST /api/orders/` - Create new order
- `GET /api/orders/` - List user orders
- `GET /api/orders/{id}/` - Get order details

## Testing

### Backend Tests

```bash
cd backend
python manage.py test shop.tests
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Development Status

The project is currently in active development. Completed features:

- [x] Backend API setup with models and endpoints
- [x] Frontend main layout and product listings
- [x] Cart functionality with Context API
- [x] Product details and filtering
- [x] Multi-step checkout form
- [x] Order confirmation page
- [x] User account section
- [x] Order history with status tracking
- [x] Delivery details management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
