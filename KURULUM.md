# Parla Seramik - Kurulum Rehberi

## Adım Adım Kurulum

### 1. Projeyi İndirin
```bash
git clone <repository-url>
cd parla-seramik
```

### 2. Docker ile Veritabanlarını Başlatın

```bash
# Docker container'ları başlat (PostgreSQL ve Redis)
docker-compose up -d

# Container'ların çalıştığını kontrol edin
docker ps
```

Şu container'ları görmelisiniz:
- `parla-seramik-postgres` (Port: 5432)
- `parla-seramik-redis` (Port: 6379)

### 3. Backend'i Çalıştırın

```bash
cd backend

# Maven ile projeyi derleyin
mvn clean install

# Spring Boot uygulamasını başlatın
mvn spring-boot:run
```

Backend başarıyla başladığında:
- API: http://localhost:8080
- Swagger UI (opsiyonel): http://localhost:8080/swagger-ui.html

### 4. Frontend'i Çalıştırın

Yeni bir terminal açın:

```bash
cd frontend

# Node modüllerini yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Frontend başarıyla başladığında:
- Web Sitesi: http://localhost:3000

### 5. İlk Admin Kullanıcısını Oluşturun

Backend çalışırken, bir REST client (Postman, Insomnia vb.) veya curl ile:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@parlaseramik.com",
    "password": "admin123"
  }'
```

Ardından veritabanında bu kullanıcının role'ünü ADMIN olarak güncelleyin:

```sql
-- PostgreSQL'e bağlanın
docker exec -it parla-seramik-postgres psql -U parla_admin -d parla_seramik

-- Kullanıcıyı admin yapın
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@parlaseramik.com';
```

### 6. Test Kategorileri ve Ürünleri Ekleyin

Admin hesabıyla giriş yapın ve Admin Panel'den:
1. Kategoriler ekleyin (örn: Kupalar, Tabaklar, Vazolar)
2. Ürünler ekleyin

## Sorun Giderme

### Backend Başlamıyor
- Java 17+ kurulu olduğundan emin olun: `java -version`
- PostgreSQL container'ının çalıştığını kontrol edin: `docker ps`
- Port 8080'in kullanılmadığını kontrol edin

### Frontend Başlamıyor
- Node.js 18+ kurulu olduğundan emin olun: `node -v`
- `node_modules` klasörünü silin ve tekrar `npm install` çalıştırın
- Port 3000'in kullanılmadığını kontrol edin

### Veritabanı Bağlantı Hatası
- Docker container'larının çalıştığını kontrol edin: `docker ps`
- Container loglarını kontrol edin: `docker logs parla-seramik-postgres`
- `application.yml` dosyasındaki bağlantı bilgilerini kontrol edin

### CORS Hatası
- `application.yml` dosyasında frontend URL'inin CORS allowed-origins listesinde olduğundan emin olun
- Backend'i yeniden başlatın

## Üretim Ortamı İçin

### Backend
```bash
cd backend
mvn clean package
java -jar target/parla-seramik-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# dist klasörünü bir web sunucusuna deploy edin
```

## Veritabanı Yedekleme

```bash
# PostgreSQL yedekleme
docker exec parla-seramik-postgres pg_dump -U parla_admin parla_seramik > backup.sql

# Geri yükleme
docker exec -i parla-seramik-postgres psql -U parla_admin parla_seramik < backup.sql
```

## Yardım

Sorun yaşarsanız:
1. Logları kontrol edin
2. README.md dosyasını okuyun
3. GitHub Issues'da sorun açın
