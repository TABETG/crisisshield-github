package com.crisisshield.crisisshieldbackend.application;

import com.crisisshield.crisisshieldbackend.domain.User;
import com.crisisshield.crisisshieldbackend.domain.UserRepository;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.exceptions.QrGenerationException;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecretGenerator secretGenerator;
    private final QrGenerator qrGenerator;
    private final CodeVerifier codeVerifier;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            SecretGenerator secretGenerator,
            QrGenerator qrGenerator,
            CodeVerifier codeVerifier
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.secretGenerator = secretGenerator;
        this.qrGenerator = qrGenerator;
        this.codeVerifier = codeVerifier;
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findUserById(String id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        return userRepository.save(user);
    }

    public User updateUser(String id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setRoles(userDetails.getRoles());
        user.setEnabled(userDetails.isEnabled());

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    // =========================
    // MFA (TOTP)
    // =========================

    public String generateMfaSecret(String username) {
        User user = getByUsername(username);
        String secret = secretGenerator.generate();
        user.setMfaSecret(secret);
        userRepository.save(user);
        return secret;
    }

    public String generateQrCodeImageUri(String secret, String email) throws QrGenerationException {
        QrData data = new QrData.Builder()
                .label(email)
                .secret(secret)
                .issuer("CrisisShield")
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

        return "data:" + qrGenerator.getImageMimeType() + ";base64," + qrGenerator.generate(data);
    }

    public boolean verifyMfaCode(String secret, String code) {
        String normalized = (code == null) ? "" : code.replace(" ", "");
        return codeVerifier.isValidCode(secret, normalized);
    }

    public boolean enableMfa(String username, String code) {
        User user = getByUsername(username);

        if (user.getMfaSecret() == null || user.getMfaSecret().isBlank()) {
            throw new IllegalStateException("MFA secret is missing. Generate it first.");
        }

        if (verifyMfaCode(user.getMfaSecret(), code)) {
            user.setMfaEnabled(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public void disableMfa(String username) {
        User user = getByUsername(username);
        user.setMfaEnabled(false);
        user.setMfaSecret(null);
        userRepository.save(user);
    }
}
