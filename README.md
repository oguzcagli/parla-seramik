# Parla Seramik E-Ticaret Platformu

Parla Seramik için geliştirilmiş modern, full-stack e-ticaret platformu.

## 🚀 Teknolojiler

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Hibernate (JPA)**
- **PostgreSQL**
- **Redis**
- **Spring Security + JWT**
- **WebSocket**
- **Lombok**
- **Maven**

### Frontend
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Vite**
- **Zustand** (State Management)
- **React Router**
- **Axios**
- **i18next** (Çoklu Dil Desteği)

## 📋 Özellikler

### Genel
- ✅ Türkçe ve İngilizce dil desteği
- ✅ Responsive tasarım
- ✅ Modern ve kullanıcı dostu arayüz
- ✅ JWT tabanlı kimlik doğrulama
- ✅ Redis ile önbellekleme

### Kullanıcı Özellikleri
- 🛍️ Ürün listeleme ve arama
- 🔍 Kategori bazlı filtreleme
- 🛒 Sepet yönetimi
- ⭐ Ürün değerlendirme ve yorum
- 👤 Kullanıcı kayıt ve giriş
- 📦 Sipariş takibi

### Admin Paneli
- 📦 Ürün CRUD işlemleri
- 📁 Kategori yönetimi
- 🛍️ Sipariş yönetimi
- 💬 Yorum onaylama ve yönetimi
- 📊 Dashboard

## 🛠️ Kurulum

### Gereksinimler
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven

### 1. Veritabanı Kurulumu

```bash
# Docker container'ları başlat
docker-compose up -d
```

Bu komut PostgreSQL ve Redis container'larını başlatacaktır.

### 2. Backend Kurulumu

```bash
cd backend

# Bağımlılıkları yükle ve uygulamayı çalıştır
mvn clean install
mvn spring-boot:run
```

Backend http://localhost:8080 adresinde çalışacaktır.

### 3. Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Frontend http://localhost:3000 adresinde çalışacaktır.

## 🔧 Yapılandırma

### Backend Yapılandırması
`backend/src/main/resources/application.yml` dosyasında:
- Veritabanı bağlantı bilgileri
- Redis yapılandırması
- JWT secret key
- CORS ayarları

### Frontend Yapılandırması
`frontend/vite.config.ts` dosyasında:
- API proxy ayarları
- Port yapılandırması

## 📁 Proje Yapısı

```
parla-seramik/
├── backend/
│   ├── src/main/java/com/parlaseramik/
│   │   ├── config/          # Yapılandırma sınıfları
│   │   ├── controller/      # REST Controller'lar
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA Entity'ler
│   │   ├── exception/      # Exception Handler'lar
│   │   ├── repository/     # JPA Repository'ler
│   │   ├── security/       # Security & JWT
│   │   └── service/        # Business Logic
│   └── src/main/resources/
│       └── application.yml
├── frontend/
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── services/      # API servisleri
│   │   ├── store/         # Zustand store'lar
│   │   ├── types/         # TypeScript tipleri
│   │   ├── utils/         # Yardımcı fonksiyonlar
│   │   └── i18n/          # Çoklu dil dosyaları
│   └── package.json
└── docker-compose.yml
```

## 🎨 Tema Rengi

Ana tema rengi: `#b5a174` (Altın/Bej tonu)

## 🔐 Varsayılan Admin Hesabı

İlk admin hesabını oluşturmak için backend'de bir migration veya init script eklenmelidir.

## 📝 API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/products` - Ürün listesi
- `GET /api/products/{id}` - Ürün detayı
- `GET /api/categories` - Kategori listesi

### Protected Endpoints (Admin)
- `POST /api/admin/products` - Ürün ekleme
- `PUT /api/admin/products/{id}` - Ürün güncelleme
- `DELETE /api/admin/products/{id}` - Ürün silme
- `GET /api/admin/orders` - Sipariş listesi
- `PATCH /api/admin/reviews/{id}/approve` - Yorum onaylama

## 🚧 Gelecek Geliştirmeler

- [ ] iyzico ödeme entegrasyonu
- [ ] E-posta bildirimleri
- [ ] Ürün resim yükleme
- [ ] Gelişmiş sipariş takibi
- [ ] Kullanıcı profil sayfası
- [ ] Favori ürünler
- [ ] Ürün karşılaştırma

## 📄 Lisans

Bu proje özel bir projedir.

## 👥 İletişim

Sorularınız için: info@parlaseramik.com
