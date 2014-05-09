package org.unterhofer.angular.multimodule.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.unterhofer.angular.multimodule.model.Book;
import org.unterhofer.angular.multimodule.model.Movie;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "books", path = "books")
public interface BookRepository extends PagingAndSortingRepository<Book,Long> {
    List<Movie> findByNameLike(@Param("name") String name);

    List<Movie> findByYear(@Param("year") Integer year);

    List<Movie> findByAuthor(@Param("author") String author);
}
