package fr.vote.proj.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import fr.vote.proj.domain.participant;
import fr.vote.proj.domain.poll;
import fr.vote.proj.services.participantRepository;
import fr.vote.proj.services.pollRepository;

@Component
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private participantRepository partRepo;
    @Autowired
    private pollRepository pollRepo;

    @Override

    public UserDetails loadUserByUsername(String mail) throws UsernameNotFoundException {

        if (mail.contains("@")) {
            participant par = this.partRepo.findByMail(mail);
            if (par == null) {
                throw new UsernameNotFoundException("No participants with the email provided");
            }
            return new org.springframework.security.core.userdetails.User(mail, par.getDefaultPass(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_PARTICIPANT")));
        } else {
            poll po = this.pollRepo.findBySlug(mail);// mail is a slug there
            if (po == null) {
                throw new UsernameNotFoundException("No poll with the slug provided");
            }
            return new org.springframework.security.core.userdetails.User(mail, po.getAdminPass(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }
    }

}
