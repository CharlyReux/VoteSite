package fr.vote.proj.controllers;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.vote.proj.domain.participant;
import fr.vote.proj.domain.poll;
import fr.vote.proj.domain.vote;
import fr.vote.proj.security.JWTUtil;
import fr.vote.proj.services.participantRepository;
import fr.vote.proj.services.pollRepository;
import fr.vote.proj.services.voteRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/log")
public class logInController {
    @Autowired
    private pollRepository pollRepo;

    @Autowired
    private voteRepository voteRepo;

    @Autowired
    private participantRepository partRepo;

    @Autowired
    private JWTUtil jwtUtil;
    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Operation(summary = "logs the admin")
    @Tag(name = "log")
    @PostMapping("/admin/{pollSlug}")
    public ResponseEntity<Map<String, Object>> LogIn(@PathVariable String pollSlug,
            @RequestBody(required = true) String password) {
        try {
            UsernamePasswordAuthenticationToken authInputToken = new UsernamePasswordAuthenticationToken(pollSlug,
                    password);

            authManager.authenticate(authInputToken);

            String token = jwtUtil.generateToken(pollSlug, "admin");

            return new ResponseEntity<>(Collections.singletonMap("jwt-token", token), HttpStatus.OK);
        } catch (AuthenticationException authExc) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "logs the participant")
    @Tag(name = "log")
    @PostMapping("/participant/{pollSlug}")
    public ResponseEntity<Map<String, Object>> LogInPart(@PathVariable String pollSlug,
            @RequestBody(required = true) String mail) {
        try {
            List<participant> l = pollRepo.findBySlug(pollSlug).getParticipants();
            boolean contains = false;
            for (participant p : l) {
                if (p.getMail().equals(mail)) {
                    contains = true;
                    break;
                }
            }
            if (!contains) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
            UsernamePasswordAuthenticationToken authInputToken = new UsernamePasswordAuthenticationToken(mail,
                    mail);

            authManager.authenticate(authInputToken);

            String token = jwtUtil.generateToken(mail, "Participant");

            return new ResponseEntity<>(Collections.singletonMap("jwt-token", token), HttpStatus.OK);
        } catch (AuthenticationException authExc) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Creates a poll")
    @PostMapping(path = "/polls")
    @Tag(name = "Poll")
    @Transactional
    public ResponseEntity<Map<String, Object>> createPoll(
            @RequestBody(required = true) poll poll) {

        // first checking that users does not already exists
        for (participant p : poll.getParticipants()) {
            if (partRepo.findByMail(p.getMail()) != null) {
                Map<String, Object> outMap = new HashMap<>();
                outMap.put("alreadyExists", p.getMail());
                return new ResponseEntity<>(outMap, HttpStatus.OK);
            }
        }

        // Encrypting the password
        poll.setAdminPass(passwordEncoder.encode(poll.getAdminPass()));

        int voteIndex = 0;
        for (vote v : poll.getVotes()) {
            v.setVoteNumber(voteIndex);
            v.setPoll(poll);
            this.voteRepo.save(v);
            voteIndex++;
        }
        for (participant p : poll.getParticipants()) {
            p.setPoll(poll);
            p.setDefaultPass(passwordEncoder.encode(p.getMail()));
            this.partRepo.save(p);
        }
        poll savedPoll = this.pollRepo.save(poll);

        String adminToken = jwtUtil.generateToken(savedPoll.getSlug(), "admin");

        Map<String, Object> outMap = new HashMap<>();
        outMap.put("jwt-token", adminToken);
        outMap.put("pollSlug", savedPoll.getSlug());
        return new ResponseEntity<>(outMap, HttpStatus.CREATED);
    }

    @Operation(summary = "Testing that the poll exists")
    @GetMapping("/verify/{slugPoll}")
    @Tag(name = "Poll")
    public ResponseEntity<Boolean> verifyExists(@PathVariable String slugPoll) {
        poll p = pollRepo.findBySlug(slugPoll);
        if (p == null) {
            return new ResponseEntity<Boolean>(false, HttpStatus.OK);
        } else {
            return new ResponseEntity<Boolean>(true, HttpStatus.OK);
        }
    }

}
