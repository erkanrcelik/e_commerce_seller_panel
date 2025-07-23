# Playable Factory Satıcı Paneli

Next.js, TypeScript ve Tailwind CSS ile geliştirilmiş modern, responsive satıcı yönetim dashboard'u. Bu uygulama satıcılara ürünlerini, siparişlerini, kampanyalarını ve profil bilgilerini yönetmek için kapsamlı araçlar sunar.

## 🚀 Özellikler

### Temel Özellikler
- **Ürün Yönetimi**: Resimler, varyantlar ve özelliklerle ürün listelerini oluşturma, düzenleme, silme ve yönetme
- **Sipariş Yönetimi**: Durum güncellemeleri ve takip bilgileriyle müşteri siparişlerini görüntüleme ve yönetme
- **Kampanya Yönetimi**: İndirim ayarlarıyla promosyon kampanyaları oluşturma ve yönetme
- **Profil Yönetimi**: Çalışma saatleri ve sosyal medya linkleriyle tam satıcı profili kurulumu
- **Dashboard Analitikleri**: Gerçek zamanlı istatistikler ve performans metrikleri
- **Kimlik Doğrulama**: E-posta doğrulama ve şifre sıfırlama ile güvenli giriş/çıkış

### Gelişmiş Özellikler
- **Toplu İşlemler**: Ürünlerde toplu seçim ve işlem yapma
- **Resim Yükleme**: Önizleme ile sürükle-bırak resim yükleme
- **Gerçek Zamanlı Güncellemeler**: Canlı durum güncellemeleri ve bildirimler
- **Responsive Tasarım**: Tüm cihazlarda çalışan mobil öncelikli tasarım
- **Karanlık Mod Desteği**: Yerleşik karanlık/aydınlık tema değiştirme
- **Arama ve Filtreleme**: Gelişmiş arama ve filtreleme özellikleri
- **Dışa/İçe Aktarma**: Ürün verisi dışa ve içe aktarma işlevselliği

## 🛠 Teknoloji Stack'i

### Frontend
- **Next.js 15.4.2** - App Router ile React framework'ü
- **TypeScript** - Tip güvenli JavaScript
- **Tailwind CSS** - Utility-first CSS framework'ü
- **React Hook Form** - Validasyon ile form işleme
- **Zod** - Şema validasyonu
- **Redux Toolkit** - Durum yönetimi
- **Lucide React** - İkon kütüphanesi

### UI Bileşenleri
- **shadcn/ui** - Modern bileşen kütüphanesi
- **Radix UI** - Erişilebilir bileşen primitifleri
- **Sonner** - Toast bildirimleri

### Geliştirme Araçları
- **ESLint** - Kod linting
- **Prettier** - Kod formatlama
- **Yarn** - Paket yöneticisi

## 📋 Ön Gereksinimler

Bu projeyi çalıştırmadan önce şunlara sahip olduğunuzdan emin olun:

- **Node.js** 18.17 veya daha yüksek
- **Yarn** paket yöneticisi
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)

## 🚀 Kurulum

### 1. Repository'yi Klonlayın
```bash
git clone <repository-url>
cd playable_factory_seller
```

### 2. Bağımlılıkları Yükleyin
```bash
yarn install
```

### 3. Ortam Ayarları
Root dizinde `.env.local` dosyası oluşturun:

```env
# API Konfigürasyonu
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Kimlik Doğrulama
NEXT_PUBLIC_TOKEN_COOKIE_NAME=accessToken
NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME=refreshToken
NEXT_PUBLIC_TOKEN_EXPIRES_IN=7
NEXT_PUBLIC_COOKIE_DOMAIN=localhost
NEXT_PUBLIC_COOKIE_SECURE=false
NEXT_PUBLIC_COOKIE_SAME_SITE=lax
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
yarn dev
```

Uygulama `http://localhost:3000` adresinde erişilebilir olacak

## 👤 Demo Kimlik Bilgileri

### Satıcı Hesabı
```
E-posta: seller@example.com
Şifre: password123
```

### Test Özellikleri
- **E-posta Doğrulama**: Test için `1234` kodunu kullanın
- **Şifre Sıfırlama**: Test için `1234` kodunu kullanın
- **Tüm API endpoint'leri**: Gösterim için mock veri

## 📚 API Dokümantasyonu

### Kimlik Doğrulama Endpoint'leri
```
POST /auth/login - Satıcı girişi
POST /auth/logout - Satıcı çıkışı
POST /auth/forgot-password - Şifre sıfırlama talebi
POST /auth/reset-password - Şifre sıfırlama
GET /auth/verify-email - E-posta adresi doğrulama
GET /auth/user-info - Kullanıcı profili alma
POST /auth/refresh - Access token yenileme
```

### Ürün Yönetimi
```
GET /seller/products - Ürün listesi alma
POST /seller/products - Yeni ürün oluşturma
GET /seller/products/:id - Ürün detayları alma
PUT /seller/products/:id - Ürün güncelleme
DELETE /seller/products/:id - Ürün silme
PUT /seller/products/:id/toggle-status - Ürün durumu değiştirme
POST /seller/products/:id/upload-image - Ürün resmi yükleme
DELETE /seller/products/:id/images/:imageKey - Ürün resmi silme
POST /seller/products/import - Dosyadan ürün içe aktarma
GET /seller/products/export - Ürün verisi dışa aktarma
```

### Sipariş Yönetimi
```
GET /seller/orders - Sipariş listesi alma
GET /seller/orders/:id - Sipariş detayları alma
PUT /seller/orders/:id/status - Sipariş durumu güncelleme
PUT /seller/orders/:id/notes - Sipariş notları güncelleme
GET /seller/orders/attention/required - Dikkat gerektiren siparişler
GET /seller/orders/analytics/revenue - Gelir analitikleri
```

### Kampanya Yönetimi
```
GET /seller/campaigns - Kampanya listesi alma
POST /seller/campaigns - Yeni kampanya oluşturma
GET /seller/campaigns/:id - Kampanya detayları alma
PUT /seller/campaigns/:id - Kampanya güncelleme
DELETE /seller/campaigns/:id - Kampanya silme
PUT /seller/campaigns/:id/toggle-status - Kampanya durumu değiştirme
POST /seller/campaigns/:id/image - Kampanya resmi yükleme
```

### Profil Yönetimi
```
GET /seller/profile - Satıcı profili alma
PUT /seller/profile - Satıcı profili güncelleme
POST /seller/profile/logo - Logo yükleme
DELETE /seller/profile/logo - Logo silme
PUT /seller/profile/toggle-active - Profil durumu değiştirme
```

### Dashboard Analitikleri
```
GET /seller/dashboard/stats - Dashboard istatistikleri
GET /seller/dashboard/activities - Son aktiviteler
GET /seller/dashboard/charts - Grafik verileri
GET /seller/dashboard/performance - Performans metrikleri
```

## 🏗 Proje Yapısı

```
src/
├── app/                    # Next.js App Router sayfaları
│   ├── (auth)/            # Kimlik doğrulama sayfaları
│   └── (dashboard)/       # Dashboard sayfaları
├── components/            # Yeniden kullanılabilir UI bileşenleri
│   ├── auth/             # Kimlik doğrulama bileşenleri
│   ├── campaigns/        # Kampanya yönetimi bileşenleri
│   ├── layout/           # Layout bileşenleri
│   ├── orders/           # Sipariş yönetimi bileşenleri
│   ├── products/         # Ürün yönetimi bileşenleri
│   ├── profile/          # Profil yönetimi bileşenleri
│   └── ui/               # Temel UI bileşenleri
├── features/             # Redux slice'ları ve durum yönetimi
├── hooks/                # Özel React hook'ları
├── lib/                  # Utility kütüphaneleri ve konfigürasyonlar
├── services/             # API servis fonksiyonları
├── store/                # Redux store konfigürasyonu
├── types/                # TypeScript tip tanımları
└── utils/                # Utility fonksiyonları ve validasyonlar
```

## 🚀 Deployment

### Vercel (Önerilen)
1. GitHub repository'nizi Vercel'e bağlayın
2. Vercel dashboard'unda environment variable'ları ayarlayın
3. Main branch'e push'ta otomatik deploy

### Manuel Deployment
1. Uygulamayı build edin:
   ```bash
   yarn build
   ```

2. Production sunucusunu başlatın:
   ```bash
   yarn start
   ```

### Production için Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_COOKIE_DOMAIN=your-domain.com
NEXT_PUBLIC_COOKIE_SECURE=true
```

## 🧪 Test

### Linting Çalıştırma
```bash
yarn lint
```

### Type Checking Çalıştırma
```bash
yarn type-check
```

### Production için Build
```bash
yarn build
```

## 📝 Geliştirme Kuralları

### Kod Stili
- Tüm yeni kod için TypeScript kullanın
- ESLint konfigürasyonunu takip edin
- Kod formatlama için Prettier kullanın
- Fonksiyonlar ve bileşenler için JSDoc yorumları yazın

### Bileşen Yapısı
- Hook'larla fonksiyonel bileşenler kullanın
- Uygun error boundary'ler uygulayın
- Erişilebilirlik kurallarını takip edin
- Mümkün olduğunda shadcn/ui bileşenlerini kullanın

### Durum Yönetimi
- Global durum için Redux Toolkit kullanın
- Form durumu için React Hook Form kullanın
- Bileşen-spesifik veri için local state kullanın

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'e push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🆘 Destek

Destek ve sorular için:
- GitHub repository'sinde issue oluşturun
- Geliştirme ekibiyle iletişime geçin
- Yaygın sorunlar için dokümantasyonu kontrol edin

## 🔄 Versiyon Geçmişi

- **v1.0.0** - Temel satıcı yönetimi özellikleriyle ilk sürüm
- **v1.1.0** - Kampanya yönetimi ve gelişmiş analitikler eklendi
- **v1.2.0** - UI/UX ve performans iyileştirmeleri

---

**Not**: Bu satıcı odaklı bir uygulamadır. Müşteri yönelik özellikler için ana Playable Factory uygulamasına bakın. 