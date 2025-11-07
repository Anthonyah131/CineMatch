# 📐 Arquitectura de Navegación - CineMatch

## 🗂️ Estructura de Navegación

```
RootNavigator (Stack Principal)
│
├── Auth (Stack de Autenticación) ← SIN tabs
│   ├── OnBoarding
│   ├── Login
│   └── SignUp
│
├── App (Tab Navigator) ← CON tabs y sidebar
│   ├── HomeTab (Stack)
│   │   ├── HomeMain ← Pantalla principal con carruseles
│   │   ├── Favorites (futuro) ← Pantalla de favoritos
│   │   └── Watchlist (futuro) ← Lista "ver después"
│   │
│   ├── SearchTab (Stack)
│   │   ├── SearchMain ← Pantalla principal de búsqueda
│   │   └── SearchFilters (futuro) ← Filtros avanzados
│   │
│   └── ProfileTab (Stack)
│       ├── ProfileMain ← Pantalla principal de perfil
│       ├── EditProfile (futuro) ← Editar perfil
│       └── Settings (futuro) ← Configuración
│
└── Pantallas Standalone ← SIN tabs ni sidebar
    ├── MovieDetails ← Detalles de película
    ├── TVShowDetails (futuro) ← Detalles de serie
    ├── PersonDetails (futuro) ← Detalles de actor/director
    └── FullScreenVideo (futuro) ← Reproductor de video
```

---

## 📱 ¿Cuándo usar cada tipo de pantalla?

### 🔵 Pantallas CON Tabs (dentro de AppTabs)

**Ubicación:** `src/navigation/stacks/[HomeStack|SearchStack|ProfileStack].tsx`

**Usar para pantallas que:**
- ✅ El usuario necesita acceso rápido desde cualquier lugar
- ✅ Son parte del flujo principal de navegación
- ✅ Necesitan mostrar el tab bar para cambiar entre secciones
- ✅ Necesitan acceso al sidebar

**Ejemplos:**
- ✅ HomeMain - Pantalla principal con carruseles
- ✅ Favorites - Lista de favoritos (dentro de HomeTab)
- ✅ SearchMain - Búsqueda de películas
- ✅ ProfileMain - Perfil del usuario

### 🔴 Pantallas SIN Tabs (en RootNavigator)

**Ubicación:** `src/navigation/RootNavigator.tsx`

**Usar para pantallas que:**
- ✅ Son de contenido enfocado (fullscreen)
- ✅ No necesitan tabs porque son temporales
- ✅ El usuario llegó desde una pantalla con tabs
- ✅ Deben ocupar toda la pantalla sin distracciones

**Ejemplos:**
- ✅ MovieDetails - Detalles de película
- ✅ TVShowDetails - Detalles de serie
- ✅ PersonDetails - Biografía de actor
- ✅ FullScreenVideo - Reproductor de trailer

---

## 🛠️ Cómo Agregar Nuevas Pantallas

### 1️⃣ Pantalla CON Tabs (dentro de un Stack existente)

**Ejemplo:** Agregar pantalla de "Favoritos" en HomeTab

```tsx
// 1. Actualizar HomeStack.tsx
export type HomeStackParamList = {
  HomeMain: undefined;
  Favorites: undefined; // ← AGREGAR
};

// 2. Crear la pantalla
import FavoritesScreen from '../../screens/home/FavoritesScreen';

// 3. Agregar a la navegación
<Stack.Screen name="Favorites" component={FavoritesScreen} />

// 4. Navegar desde HomeMain
navigation.navigate('Favorites');
```

### 2️⃣ Pantalla SIN Tabs (en RootNavigator)

**Ejemplo:** Agregar pantalla de "Detalles de Serie"

```tsx
// 1. Actualizar RootNavigator.tsx
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  MovieDetails: { movieId: number };
  TVShowDetails: { tvShowId: number }; // ← AGREGAR
};

// 2. Crear la pantalla
import TVShowDetailsScreen from '../screens/tvshows/TVShowDetailsScreen';

// 3. Agregar a la navegación (después de MovieDetails)
<Stack.Screen
  name="TVShowDetails"
  component={TVShowDetailsScreen}
  options={{
    presentation: 'card',
    animation: 'slide_from_right',
  }}
/>

// 4. Navegar desde cualquier pantalla
navigation.navigate('TVShowDetails', { tvShowId: 12345 });
```

---

## 🎨 Guía de Colores

### Paleta de CineMatch
```tsx
const colors = {
  // Fondo principal
  background: '#0F0B0A',
  
  // Fondo secundario (cards, header)
  backgroundSecondary: '#1A1412',
  
  // Dorado (principal)
  primary: '#C7A24C',
  
  // Rosa (acentos, favoritos)
  accent: '#E69CA3',
  
  // Rojo (errores, eliminar)
  error: '#A4252C',
  
  // Texto principal
  textPrimary: '#F2E9E4',
  
  // Texto secundario
  textSecondary: '#C9ADA7',
};
```

### Aplicación en Tab Navigator
```tsx
// AppTabs.tsx
tabBarStyle: {
  backgroundColor: '#1A1412', // Fondo del tab bar
  borderTopColor: '#C7A24C',  // Borde superior dorado
},
tabBarActiveTintColor: '#C7A24C',  // Tab activo: dorado
tabBarInactiveTintColor: '#C9ADA7', // Tab inactivo: gris claro
```

---

## 🔑 Conceptos Clave

### Stack Navigator
- **Qué es:** Navegación apilada (como páginas en un libro)
- **Comportamiento:** Nueva pantalla encima, botón "atrás" automático
- **Uso:** HomeStack, SearchStack, ProfileStack, MovieDetails

### Tab Navigator
- **Qué es:** Navegación entre secciones (tabs en la parte inferior)
- **Comportamiento:** Cambia entre pantallas sin apilar
- **Uso:** AppTabs (Home, Search, Profile)

### ¿Por qué MovieDetails NO está en HomeStack?
- **Razón 1:** Debe ocupar toda la pantalla (fullscreen)
- **Razón 2:** No necesita tabs (el usuario está enfocado en UNA película)
- **Razón 3:** Puede ser accedida desde Home, Search, o Profile
- **Razón 4:** Más limpio visualmente sin el tab bar

### ¿Por qué Favorites SÍ estaría en HomeStack?
- **Razón 1:** El usuario puede querer cambiar rápido a Search
- **Razón 2:** Es una sección principal (como "Home" pero con filtro)
- **Razón 3:** Necesita el sidebar para cerrar sesión o cambiar cuenta

---

## 📊 Diagrama de Flujo de Navegación

```
Usuario abre app
    ↓
¿Autenticado?
    ├── NO → Auth Stack (OnBoarding → Login → SignUp)
    └── SÍ → App Tabs (con tab bar y sidebar visible)
              ↓
         ┌────┴────┬────────┬─────────┐
         │         │        │         │
      HomeTab  SearchTab ProfileTab  Sidebar
         │
    HomeMain (carruseles)
         │
    [Usuario presiona película]
         ↓
    MovieDetails (SIN tabs, fullscreen)
         │
    [Usuario presiona "atrás"]
         ↓
    Vuelve a HomeMain (CON tabs)
```

---

## 🎯 Resumen

### CON Tabs y Sidebar:
- ✅ HomeMain (carruseles)
- ✅ SearchMain (búsqueda)
- ✅ ProfileMain (perfil)
- ✅ Favorites (futuro)
- ✅ Watchlist (futuro)

### SIN Tabs ni Sidebar:
- ✅ MovieDetails (detalles de película)
- ✅ TVShowDetails (futuro)
- ✅ PersonDetails (futuro)
- ✅ FullScreenVideo (futuro)

### Regla de oro:
**Si el usuario necesita enfocarse 100% en el contenido → SIN tabs**
**Si es una sección principal del app → CON tabs**
