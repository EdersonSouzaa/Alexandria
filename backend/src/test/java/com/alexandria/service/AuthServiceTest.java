package com.alexandria.service;

import com.alexandria.config.JwtUtil;
import com.alexandria.dto.auth.AuthResponse;
import com.alexandria.dto.auth.LoginRequest;
import com.alexandria.dto.auth.RegisterRequest;
import com.alexandria.exception.DuplicateResourceException;
import com.alexandria.exception.InvalidCredentialsException;
import com.alexandria.model.User;
import com.alexandria.repository.GamificacaoRepository;
import com.alexandria.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private GamificacaoRepository gamificacaoRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User usuarioExistente;

    @BeforeEach
    void setUp() {
        usuarioExistente = User.builder()
                .id(1L)
                .name("Leitor Teste")
                .email("leitor@alexandria.com")
                .password("senha-hash")
                .build();
    }

    @Test
    void deveRegistrarNovoUsuarioComSucesso() {
        when(userRepository.existsByEmail("novo@alexandria.com")).thenReturn(false);
        when(passwordEncoder.encode("senha12345")).thenReturn("senha-hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(2L);
            return user;
        });
        when(jwtUtil.generateToken(2L, "novo@alexandria.com")).thenReturn("token-gerado");

        AuthResponse response = authService.register(new RegisterRequest("Novo Leitor", "novo@alexandria.com", "senha12345"));

        assertThat(response.token()).isEqualTo("token-gerado");
        assertThat(response.id()).isEqualTo(2L);
    }

    @Test
    void deveRecusarRegistroComEmailDuplicado() {
        when(userRepository.existsByEmail("leitor@alexandria.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(
                new RegisterRequest("Leitor Teste", "leitor@alexandria.com", "senha12345")))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void deveFazerLoginComCredenciaisValidas() {
        when(userRepository.findByEmail("leitor@alexandria.com")).thenReturn(Optional.of(usuarioExistente));
        when(passwordEncoder.matches("senha12345", "senha-hash")).thenReturn(true);
        when(jwtUtil.generateToken(1L, "leitor@alexandria.com")).thenReturn("token-gerado");

        AuthResponse response = authService.login(new LoginRequest("leitor@alexandria.com", "senha12345"));

        assertThat(response.token()).isEqualTo("token-gerado");
    }

    @Test
    void deveRecusarLoginComSenhaInvalida() {
        when(userRepository.findByEmail("leitor@alexandria.com")).thenReturn(Optional.of(usuarioExistente));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("leitor@alexandria.com", "senha-errada")))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}
