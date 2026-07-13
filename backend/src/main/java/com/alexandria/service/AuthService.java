package com.alexandria.service;

import com.alexandria.config.JwtUtil;
import com.alexandria.dto.auth.*;
import com.alexandria.exception.DuplicateResourceException;
import com.alexandria.exception.InvalidCredentialsException;
import com.alexandria.exception.ResourceNotFoundException;
import com.alexandria.model.Gamificacao;
import com.alexandria.model.User;
import com.alexandria.repository.GamificacaoRepository;
import com.alexandria.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final GamificacaoRepository gamificacaoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                        GamificacaoRepository gamificacaoRepository,
                        PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.gamificacaoRepository = gamificacaoRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Já existe uma conta cadastrada com este e-mail.");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();
        user = userRepository.save(user);

        gamificacaoRepository.save(Gamificacao.builder().usuario(user).build());

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("E-mail ou senha inválidos."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("E-mail ou senha inválidos.");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    public UserProfileResponse getProfile(Long userId) {
        User user = findUserOrThrow(userId);
        return toProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findUserOrThrow(userId);

        if (!user.getEmail().equalsIgnoreCase(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Já existe uma conta cadastrada com este e-mail.");
        }

        user.setName(request.name());
        user.setEmail(request.email());
        return toProfileResponse(user);
    }

    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Não existe conta cadastrada com este e-mail."));

        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordExpiry(Instant.now().plus(1, ChronoUnit.HOURS));

        log.info("Token de redefinição de senha gerado para o usuário {}: {}", user.getEmail(), token);

        return new ForgotPasswordResponse(
                "Um token de redefinição foi gerado. Em produção ele seria enviado por e-mail; " +
                        "neste ambiente de desenvolvimento ele é retornado diretamente.",
                token
        );
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.token())
                .orElseThrow(() -> new InvalidCredentialsException("Token de redefinição inválido."));

        if (user.getResetPasswordExpiry() == null || user.getResetPasswordExpiry().isBefore(Instant.now())) {
            throw new InvalidCredentialsException("Token de redefinição expirado.");
        }

        user.setPassword(passwordEncoder.encode(request.novaSenha()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
    }

    private User findUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(user.getId(), user.getName(), user.getEmail(), user.getCriadoEm());
    }
}
