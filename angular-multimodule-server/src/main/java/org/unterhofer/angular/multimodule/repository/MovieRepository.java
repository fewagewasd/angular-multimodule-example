package org.unterhofer.angular.multimodule.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.unterhofer.angular.multimodule.model.Movie;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "movies", path = "movies")
public interface MovieRepository extends PagingAndSortingRepository<Movie,Long> {
    List<Movie> findByNameLike(@Param("name") String name);

    List<Movie> findByYear(@Param("year") Integer year);
}
