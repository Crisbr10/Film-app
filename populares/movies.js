//DECLARACION DE VARIABLES GLOBALES PAARA UTILIZAR EN EL CODIGO
const apiKey = "3b28517a78aea610fd0a0666cd35b7b0";
const baseUrl = "https://api.themoviedb.org/3";
const base_imge = "https://image.tmdb.org/t/p/w200";
const base_imgeActor="https://image.tmdb.org/t/p/w100"
const posterImg = "https://image.tmdb.org/t/p/w500";

//HACEMOS LA PETICION A LA API UTILIZANDO LA FUNCION AJAX DE JQUERY
function peticion(uri) {
  $.ajax({
    url: uri,
    dataType: "json",
    async: true,
    success: function (data) {
      mostrarSeries(data.results);
    },
  });
}

//A CONTINUACION MOSTRAMOS LAS CARDS EN PANTALLA USANDO EL METODO APPEND()
function mostrarSeries(data) {
  data.forEach((movie) => {
    const { title, poster_path, vote_average, release_date, id } = movie;

    $("#cards").append(`
            <picture data-type="movie" class="movie" id="${id}"  data-aos="zoom-in" >
                <img src="${base_imge + poster_path}" alt="${title}">
                <section class="movieInfo">
                  <h3>${title}</h3>
                  <span class="green">${vote_average}</span>
                  
                </section>
                <span class="data">${release_date}</span>
      
            </picture>`);
  });
}

//PARA NO REPETIR EL CODIGO DE LA LLAMADA UNA Y OTRA VEZ LO ENVOLVEMOS EN UN SET INTERVAS QUE CADA 5S REALIZA LA PETICION
//SOLICITANDO DIFERENTES PAGINAS DE PELICULAS Y SERIES A LA API PARA TENER MAS CONTENIDO
for (let i = 1; i < 7; i++) {
  setInterval(
    peticion(
      `${baseUrl}/movie/popular?api_key=${apiKey}&language=es-ES&page=${i}`
    ),
    5000
  );
}

//ESTE BLOQUE DE CODIGO SE ENCARGA DE HACERLE LA PETICION A LA API DE LA SERIE O PELI QUE EL USUARIO INTRODUZCA EN EL INPUT
$("#search").on("click", () => {
  let uri = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${$(
    "#inputSearch"
  ).val()}`;
  $.ajax({
    url: uri,
    dataType: "json",
    success: function (data) {
      $(".movie").hide();
      mostrarSeries(data.results);
    },
  });
});

//PONEMOS A TODOS LOS HIJOS (.movie) DE #CARDS A LA ESCUCHA DEL EVENTO ONCLICK Y AUTOSEGUIDO OBTENEMOS SU ID
//PARA DESPUES HACER UNA PETICION A LA API CON TODA LA INFORMACIÓN.
$("#cards").on("click", ".movie", function () {
  // Código para mostrar la ventana modal
  const movieId = $(this).attr("id");

  $.ajax({
    url: `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES`,
    dataType: "json",
    success: function (data) {
      mostrarModal(data);
      console.log(data);
    },
  });
  $.ajax({
    url: 'https://api.themoviedb.org/3/movie/' + movieId + '/credits',
    type: 'GET',
    async: true,
    data: {
      api_key: apiKey
    },
    success: function(response) {
      console.log(response)
      const actors = response.cast;
      
      $('#modal').append(`<div id="actores"></div>`)
      $('#actores').append(`<h2 id="elenco">Elenco de actores</h2>`)
      $('#actores').append(`<section id="elencoFotos"></section>`)
        for(let i=0;i<actors.length;i++){
          console.log(actors[i].profile_path)
          if(actors[i].profile_path!=null){
            
            $('#elencoFotos').append(`<span>
                                  <img id="imgActor" src="${base_imge + actors[i].profile_path}"></img><br/>
                                  <h4>${actors[i].name}<br></h4>
                                  <h5>${actors[i].character}</h5>
                                </span>`)
          }
          
        }
    },
    error: function() {
      alert('Error al obtener los actores de TMDb.');
    }
  });

  $("main").hide().css("transicion", "3s");
  $("header").hide();
  function mostrarModal(data) {
    $("body")
      .append(
      `
        <img id="btnBack" src="../ICONS/back.png" alt="regresar">
        
        <div id="modal">
          <img id="imgModal" src="${posterImg + data.backdrop_path}">
          <section id="infoModal">
          <h1>${data.title}</h1>
          
          <div id="geners"></div>
          
          <p>${data.overview}</p>
          </section>
        </div>
     
     `
    );
    data.genres.forEach((genero) => {
      $("#geners").append(`<span id="genero">${genero.name}</span>`);
    });
   
    $('#btnBack').on('click',()=>{
      $('#btnBack').remove()
      $("#modal").remove()
      $("main").show().css("transicion", "3s");
      $("header").show();
    })
  }
});



