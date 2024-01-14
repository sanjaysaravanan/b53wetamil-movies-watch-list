import { useState } from "react";
import PropTypes from "prop-types";
import "./App.css";
import { useEffect } from "react";

const PopUp = ({
  handleForm,
  addMovie,
  loadedMovie = {},
  editMovie,
  clearLoadedMovie,
}) => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImage] = useState("");
  const [genre, setGenre] = useState("");

  const handleChange = (e) => {
    switch (e.target.name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "imageUrl":
        setImage(e.target.value);
        break;
      case "genre":
        setGenre(e.target.value);
        break;
      default:
        console.log("No Matching Fields");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(loadedMovie).length !== 0) {
      editMovie({ ...loadedMovie, title, imageUrl, genre });
    } else {
      addMovie({ title, imageUrl, genre });
    }
    handleForm();
  };

  useEffect(() => {
    if (Object.keys(loadedMovie).length !== 0) {
      setTitle(loadedMovie.title);
      setGenre(loadedMovie.genre);
      setImage(loadedMovie.imageUrl);
    }

    return () => {
      if (Object.keys(loadedMovie).length !== 0) {
        clearLoadedMovie();
      }
    };
  }, [loadedMovie, clearLoadedMovie]);

  return (
    <div
      className="position-fixed top-0 vw-100 d-flex justify-content-center align-items-center vh-100 pop-up"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <i onClick={handleForm} className="fa-close fa-solid fa-2x"></i>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={handleChange}
          disabled={Object.keys(loadedMovie).length !== 0}
        />
        <br />
        <br />
        <label htmlFor="imageUrl">Image:</label>
        <input
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          onChange={handleChange}
        />
        <br />
        <br />
        <label htmlFor="genre">Genre:</label>
        <input id="genre" name="genre" value={genre} onChange={handleChange} />
        <br />
        <br />
        <input type="submit" />
      </form>
    </div>
  );
};

PopUp.propTypes = {
  handleForm: PropTypes.func.isRequired,
  addMovie: PropTypes.func.isRequired,
  loadedMovie: PropTypes.shape({}),
  editMovie: PropTypes.func.isRequired,
  clearLoadedMovie: PropTypes.func.isRequired,
};

const MovieItem = ({
  title,
  imageUrl,
  genre,
  onEdit,
  onDelete,
  status,
  isLiked,
}) => {
  return (
    <div className="card" style={{ width: "18rem" }}>
      <img src={imageUrl} className="card-img-top image" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{genre}</p>
        <button onClick={() => onEdit(title)} className="bg-warning m-2">
          Edit
        </button>
        <button onClick={() => onDelete(title)} className="bg-danger m-2">
          Delete
        </button>
      </div>
    </div>
  );
};

MovieItem.propTypes = {
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  genre: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  status: PropTypes.string,
  isLiked: PropTypes.bool,
};

function App() {
  // state for popup opening
  const [openForm, setOpenForm] = useState(false);

  // state for handling the movies
  const [movies, setMovies] = useState([]);

  // State variable to load a movie into the form on editing
  const [editMovie, setEditMovie] = useState(undefined);

  const handleForm = () => {
    setOpenForm(!openForm);
  };

  // Adding a new Movie
  // by default isLiked = false, status = 'Not Watched'
  const addMovie = (movieData) => {
    setMovies([
      ...movies,
      {
        ...movieData,
        isLiked: false,
        status: "Not Watched",
      },
    ]);
  };

  // load a movie for editing
  const handleEdit = (movTitle) => {
    handleForm();
    const movie = movies.find(({ title }) => title === movTitle);
    setEditMovie(movie);
  };

  // editing a movie
  const handleEditMovie = (movieData) => {
    const movieIndex = movies.findIndex(
      ({ title }) => title === movieData.title
    );

    const tempMovies = [...movies];

    tempMovies[movieIndex] = movieData;

    setMovies(tempMovies);
  };

  const clearLoadedMovie = () => {
    setEditMovie(undefined);
  };

  return (
    <>
      <div style={{ margin: 16 }}>
        {console.log(movies)}
        <button style={{ float: "right" }} onClick={handleForm}>
          <i className="fa-solid fa-plus"></i>
        </button>
        <div className="movies-container">
          {movies.map((movie) => (
            <MovieItem key={movie.title} onEdit={handleEdit} {...movie} />
          ))}
        </div>
      </div>
      {openForm && (
        <PopUp
          handleForm={handleForm}
          addMovie={addMovie}
          editMovie={handleEditMovie}
          loadedMovie={editMovie}
          clearLoadedMovie={clearLoadedMovie}
        />
      )}
    </>
  );
}

export default App;
