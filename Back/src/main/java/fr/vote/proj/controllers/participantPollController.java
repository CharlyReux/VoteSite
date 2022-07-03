package fr.vote.proj.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import fr.vote.proj.domain.participant;
import fr.vote.proj.domain.participation;
import fr.vote.proj.domain.poll;
import fr.vote.proj.domain.vote;
import fr.vote.proj.services.participantRepository;
import fr.vote.proj.services.participationRepository;
import fr.vote.proj.services.pollRepository;
import fr.vote.proj.services.voteRepository;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@EnableScheduling
@RequestMapping("/api/userPart")
public class participantPollController {
    // Poll participation specific endpoints

    public static Map<String, List<SseEmitter>> slugToClients = new HashMap<String, List<SseEmitter>>();

    @Autowired
    private pollRepository pollRepo;

    @Autowired
    private participationRepository partionRepo;

    @Autowired
    private participantRepository partRepo;

    @Autowired
    private voteRepository voteRepo;

    @PostMapping("{slugPoll}/participation/{mailUser}")
    @Operation(summary = "adds a participation in the current vote")
    @Transactional
    public ResponseEntity<poll> addParticipation(@RequestBody(required = true) participation participation,
            @PathVariable String slugPoll, @PathVariable String mailUser) {



        // finds the poll specified
        poll p = this.pollRepo.findBySlug(slugPoll);
        if (p == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // verifying the user
        participant part = this.partRepo.findByMail(mailUser);
        if (part == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if (part.hasVoted(p.getCurrentVote())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        if (!p.getVotes().get(p.getCurrentVote()).isEnCours()) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        } // TOTEST

        // verifying the vote
        int idCurrentVote = p.getCurrentVote();
        vote currentVote = p.getVotes().get(idCurrentVote);
        if (currentVote == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        participation.setParticipant(part);
        participation.setVote(currentVote);
        this.partionRepo.save(participation);

        // adding to the user
        part.getParticipations().add(participation);
        this.partRepo.save(part);

        // adding to the vote
        currentVote.getParticipations().add(participation);
        currentVote.setPoll(p);
        this.voteRepo.save(currentVote);

        // saving the poll
        this.pollRepo.save(p);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(summary = "Subscribes to the poll")
    @GetMapping("/subscribe/{pollSlug}")
    public ResponseEntity<SseEmitter> subscribe(@PathVariable String pollSlug) {
        // checking that the poll exists
        poll p = this.pollRepo.findBySlug(pollSlug);
        if (p == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // creating a new emitter
        SseEmitter emitter = new SseEmitter(600000L);
        // adding the emitter to the map
        if (slugToClients.containsKey(pollSlug)) {
            slugToClients.get(pollSlug).add(emitter);
        } else {
            List<SseEmitter> newSseList = new ArrayList<SseEmitter>();
            newSseList.add(emitter);
            slugToClients.put(pollSlug, newSseList);
        }
        // creating a simple object just to send data to the user
        Map<String, Object> subscribedEvent = new HashMap<>();
        subscribedEvent.put("voteSlug", p.getSlug());

        try {
            emitter.send(SseEmitter.event()
                    .name("subscribed")
                    .data(subscribedEvent));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(emitter, HttpStatus.OK);
    }

    @Scheduled(fixedRate = 30000)
    public void keepConnect() {
            // creating a simple object just to send heartBeat to the user
            Map<String, Object> subscribedEvent = new HashMap<>();
            subscribedEvent.put("heartBeat", "heartNeat");

            for (List<SseEmitter> listSse : slugToClients.values()) {
                for (SseEmitter s : listSse) {
                    try {
                        s.send(SseEmitter.event().name("heartbeat")
                        .data("heartbeat"));
                        
                    } catch (Exception e) {
                    }
                }
            }

    }
}
