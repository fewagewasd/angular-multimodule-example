package org.unterhofer.angular.multimodule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;
import org.unterhofer.angular.multimodule.model.Book;
import org.unterhofer.angular.multimodule.model.Movie;
import org.unterhofer.angular.multimodule.repository.BookRepository;
import org.unterhofer.angular.multimodule.repository.MovieRepository;

import javax.annotation.PostConstruct;

@Configuration
@ComponentScan
@EnableTransactionManagement
@Import(RepositoryRestMvcConfiguration.class)
@EnableAutoConfiguration
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private BookRepository bookRepository;

    @Transactional
    @PostConstruct
    public void populateDB() {
        initMovies();
        initBooks();
    }

    private void initMovies() {
        movieRepository.save(new Movie("The Godfather", 1972));
        movieRepository.save(new Movie("The Godfather: Part II", 1974));
        movieRepository.save(new Movie("Dirty Harry", 1971));
        movieRepository.save(new Movie("Magnum Force", 1973));
        movieRepository.save(new Movie("The Enforcer", 1976));
        movieRepository.save(new Movie("Sudden Impact", 1983));
        movieRepository.save(new Movie("The Dead Pool", 1988));
        movieRepository.save(new Movie("Die Hard", 1988));
        movieRepository.save(new Movie("Alien", 1979));
        movieRepository.save(new Movie("Aliens", 1986));
        movieRepository.save(new Movie("Alien 3", 1992));
        movieRepository.save(new Movie("Raiders of the Lost Ark", 1981));
        movieRepository.save(new Movie("Indiana Jones and the Temple of Doom", 1984));
        movieRepository.save(new Movie("Indiana Jones and the Last Crusade", 1989));
        movieRepository.save(new Movie("Star Wars Episode IV - A New Hope", 1977));
        movieRepository.save(new Movie("Star Wars Episode V - The Empire Strikes Back", 1980));
        movieRepository.save(new Movie("Star Wars Episode V - Return of the Jedi", 1983));
        movieRepository.save(new Movie("Monty Python and the Holy Grail", 1975));
        movieRepository.save(new Movie("Monty Python's Life of Brian", 1979));
        movieRepository.save(new Movie("Monty Python's The Meaning of Life", 1983));
    }

    private void initBooks() {
        bookRepository.save(new Book("Java Persistence with Hibernate", "Christian Bauer, Gavin King, Gary Gregory", 2014));
        bookRepository.save(new Book("Beginning Hibernate", "Joseph Ottinger, Jeff Linwood, Dave Minter", 2014));
        bookRepository.save(new Book("Pro AngularJS", "Adam Freeman", 2014));
        bookRepository.save(new Book("ng-book - The Complete Book on AngularJS", "Ari Lerner", 2013));
        bookRepository.save(new Book("Secrets of the JavaScript Ninja", "John Resig, Bear Bibeault ", 2012));
        bookRepository.save(new Book("Spring in Action", "Craig Walls", 2011));
    }
}
