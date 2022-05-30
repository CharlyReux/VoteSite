package fr.vote.proj.services;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import fr.vote.proj.domain.participant;

public interface participantRepository extends CrudRepository<participant,Long>{
    
    List<participant> findAll();

    participant findByMail(String mail);

}
