package fr.vote.proj.services;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

import fr.vote.proj.domain.poll;

public interface pollRepository extends CrudRepository<poll, Long> {

    List<poll> findAll();

    poll findBySlug(String slug);


}
