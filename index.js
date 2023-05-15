const apiKey = "3b28517a78aea610fd0a0666cd35b7b0";
const baseUrl = "https://api.themoviedb.org/3";
const base_imge='https://image.tmdb.org/t/p/w500'

// Hacemos una petición para obtener las películas populares
fetch('$https://api.themoviedb.org/3/movie/popular?api_key=3b28517a78aea610fd0a0666cd35b7b0')
  .then(response => response.json())
  .then(data => {
    // La petición fue exitosa, aquí se maneja la respuesta
    console.log(data)
    
    // Para cada película, hacemos otra petición para obtener la imagen
    movies.forEach(movie => {
      fetch(`${baseUrl}/movie/${movie.id}/images?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          // La petición fue exitosa, aquí se maneja la respuesta
          const images = data.backdrops;
          console.log(`Imágenes de la película ${movie.title}:`, images);
        })
        .catch(error => {
          // Ocurrió un error al hacer la petición
          console.error(`Error al obtener imágenes de la película ${movie.title}:`, error);
        });
    });
  })
  .catch(error => {
    // Ocurrió un error al hacer la petición
    console.error("Error al obtener películas:", error);
  });
