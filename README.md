# Frontend de la API
BIEN aqui se detallara el proceso que se uso o como esta estructurado el proyecto del frontend de la api

## PROCEDIMIENTO

- **Autenticación de Usuarios**: Sistema de login y manejo de sesiones utilizando tokens.

- **ENVIRONMENT VARIABLES**: Se utilizara variables de entorno para poder identificar los tokens generados en el
                             NEXT_PUBLIC_API_URL=http://localhost:8000/api
                             NEXT_PUBLIC_MASTER_TOKEN=1|BAGMB7jlXOp9baUgavjMDEtc0HuYY6dtb85D7yV914f3a4c6

### Sistema de Autenticación
- Implementa un sistema de login seguro.
- Utiliza tokens  para manejar las sesiones de usuario.

### Dashboard
- Muestra información personalizada para el usuario autenticado.
### ENCABEZADO
![ENCABEZADO DE USUARIO](APIS-consumo2\public\ss\header.png)

```javascript
function Header() {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
   const { user, logout } = useAuth()
   const dropdownRef = useRef(null)

   return (
       user && (
           <div ref={dropdownRef}>
               <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                   {user.url_imagenPerfil ? <img src={user.url_imagenPerfil} alt="Foto" /> : <FaUserCircle />}
               </button>
               {isDropdownOpen && (
                   <div>
                       <button onClick={logout}>
                           <FaSignOutAlt /> Cerrar Sesión
                       </button>
                   </div>
               )}
               <div>
                   <span>{user.nombre} {user.apellido}</span>
                   <span>{user.correo_electronico}</span>
               </div>
           </div>
       )
   )
}
```


- Incluye nuestras 2 tablas de gestion tanto de usuarios como de canciones.

### Gestión de Usuarios
- Permite agregar nuevos usuarios con un formulario interactivo.
- Ofrece la capacidad de editar información de usuarios existentes.
- Implementa validación de formularios y manejo de errores.

## Capturas de Pantalla

### Página de Inicio
![Página de Inicio](https://github.com/K451AKM/APIS-consumo2/blob/master/pagina%20inicio.jpg)

### Página de Login
![Página de Login](https://github.com/K451AKM/APIS-consumo2/blob/master/login.jpg)

### Dashboard
![Dashboard](https://github.com/K451AKM/APIS-consumo2/blob/master/ds.jpg)

### Gestión de Usuarios
![Lista de Usuarios](https://github.com/K451AKM/APIS-consumo2/blob/master/usersC.jpg)

#### Acciones de Usuario

**Agregar Usuario**
- ![Agregar Usuario](https://github.com/K451AKM/APIS-consumo2/blob/master/agregarUsuario.jpg)

**Editar Usuario**
- ![Editar Usuario](https://github.com/K451AKM/APIS-consumo2/blob/master/usuarioEditado.jpg)

**Ver Usuario**
- ![Ver Usuario](https://github.com/K451AKM/APIS-consumo2/blob/master/verUsuario.jpg)

**Eliminar Usuario**
- ![Eliminar Usuario](https://github.com/K451AKM/APIS-consumo2/blob/master/eliminarUsuario.jpg)

### Gestión de Pokémones
![Lista de Pokémones](https://github.com/K451AKM/APIS-consumo2/blob/master/pokemones.jpg)

#### Acciones de Pokémones

**Agregar Pokémon**
- ![Agregar Pokémon](https://github.com/K451AKM/APIS-consumo2/blob/master/agregarPokemon.jpg)

**Ver Pokémon**
- ![Ver Pokémon](https://github.com/K451AKM/APIS-consumo2/blob/master/verpokemon.jpg)

**Editar Pokémon**
- ![Editar Pokémon](https://github.com/K451AKM/APIS-consumo2/blob/master/editar%20pokemon.jpg)

**Eliminar Pokémon**
- ![Eliminar Pokémon](https://github.com/K451AKM/APIS-consumo2/blob/master/eliminarpokemon.jpg)