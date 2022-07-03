package fr.vote.proj.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import fr.vote.proj.domain.participant;
import fr.vote.proj.domain.poll;
import fr.vote.proj.domain.vote;
import fr.vote.proj.services.participantRepository;
import fr.vote.proj.services.pollRepository;
import fr.vote.proj.services.voteRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/poll")
public class pollController {

    @Autowired
    private pollRepository pollRepo;

    @Autowired
    private participantRepository partRepo;

    @Autowired
    private voteRepository voteRepo;

    // sse endpoints

    @Operation(summary = "starts the current vote")
    @GetMapping("/startVote/{pollSlug}")
    @Tag(name = "Poll")
    public void startVote(@PathVariable String pollSlug) {
        poll p = this.pollRepo.findBySlug(pollSlug);



        vote v = p.getVotes().get(p.getCurrentVote());

        Date d = new Date(System.currentTimeMillis());
        v.setStartTime(d);
        v.setEnCours(true);
        v.setPoll(p);// TOTEST
        this.voteRepo.save(v);
        this.pollRepo.save(p);

        // creating a simple version of the vote to send to the user
        Map<String, Object> simpleVote = new HashMap<>();
        simpleVote.put("title", v.getTitle());
        simpleVote.put("description", v.getDescription());
        simpleVote.put("startTime", v.getStartTime());
        simpleVote.put("Duration", v.getDuration());
        simpleVote.put("isEnded", p.isEnded());


        try {
            for (SseEmitter s : participantPollController.slugToClients.get(pollSlug)) {
                s.send(SseEmitter.event()
                        .name("startVote")
                        .data(simpleVote));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        // starting the timer
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {

            @Override
            public void run() {
                v.setEnCours(false);
                v.setPoll(p);
                voteRepo.save(v);
                pollRepo.save(p);
                // creating a simple version of the vote to send to the user
                Map<String, Object> simpleVote = new HashMap<>();
                simpleVote.put("title", v.getTitle());
                simpleVote.put("description", v.getDescription());
                simpleVote.put("startTime", v.getStartTime());
                simpleVote.put("Duration", v.getDuration());
                simpleVote.put("isEnded", p.isEnded());

                try {
                    for (SseEmitter s : participantPollController.slugToClients.get(pollSlug)) {
                        s.send(SseEmitter.event()
                                .name("endVote")
                                .data(simpleVote));
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
                if(p.isEnded()){
                    participantPollController.slugToClients.remove(pollSlug);
                }
            }

        }, v.getDuration() * 1000);

    }

    // Poll specific endpoints

    @Operation(summary = "Gets all the polls")
    @GetMapping("/all")
    @Tag(name = "Poll")
    public ResponseEntity<List<poll>> getAllPolls() {
        List<poll> p = pollRepo.findAll();
        if (p == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<List<poll>>(p, HttpStatus.OK);
    }

    @Operation(summary = "switch to the next vote")
    @PutMapping(path = "/nextVote/{slugPoll}")
    @Tag(name = "Poll")
    @Transactional
    public ResponseEntity<poll> nextVote(@PathVariable String slugPoll) {
        poll p = this.pollRepo.findBySlug(slugPoll);
        if (p == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        p.nextVote();
        poll savedPoll = this.pollRepo.save(p);
        return new ResponseEntity<>(savedPoll, HttpStatus.OK);
    }


    @Operation(summary = "switch to the next vote")
    @PutMapping(path = "/getPoll/{slugPoll}")
    @Tag(name = "Poll")
    @Transactional
    public ResponseEntity<poll> getPollBySlug(@PathVariable String slugPoll) {
        poll p = this.pollRepo.findBySlug(slugPoll);
        if (p == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(p, HttpStatus.OK);
    }

    // vote specific endpoints
    @Tag(name = "Votes")
    @GetMapping("/votes/all")
    @Operation(summary = "return all the votes ")
    public ResponseEntity<List<vote>> getAllVotes() {
        return new ResponseEntity<>(this.voteRepo.findAll(), HttpStatus.FOUND);
    }

    // participant specific endpoints
    @Tag(name = "Participant")
    @GetMapping("/participant/all")
    @Operation(summary = "return all the participants ")
    public ResponseEntity<List<participant>> getAllParticipants() {
        return new ResponseEntity<>(this.partRepo.findAll(), HttpStatus.FOUND);
    }
}
