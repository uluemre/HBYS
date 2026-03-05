package com.hastane.hastane_backend.service;

import com.hastane.hastane_backend.entity.Rol;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // 🔐 Sabit Base64 secret key (256 bit)
    private static final String SECRET =
            "ZG9rdG9yX2hhc3RhbmVfYXBwbGljYXRpb25fc2VjcmV0X2tleV8yMDI2X2hieXM=";

    private final Key key =
            Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET));

    // ✅ TOKEN ÜRET
    public String generateToken(String tcNo, Rol rol) {

        return Jwts.builder()
                .setSubject(tcNo)
                .claim("rol", rol.name()) // ✅ DÜZELTİLDİ
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 5))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ TOKEN'DAN TC AL
    public String extractTcNo(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ✅ TOKEN'DAN ROL AL
    public String extractRol(String token) {
        return extractAllClaims(token).get("rol", String.class);
    }

    // ✅ TOKEN DOĞRULA
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}