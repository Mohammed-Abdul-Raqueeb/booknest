package com.library.backend.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static boolean isAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if ("ROLE_ADMIN".equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    public static Long currentUserId(Authentication authentication) {
        if (authentication == null) {
            return null;
        }
        Object details = authentication.getDetails();
        return details instanceof Long ? (Long) details : null;
    }

    /**
     * Throws AccessDeniedException unless the authenticated user is either an
     * admin or the same person as {@code targetId}.
     */
    public static void requireSelfOrAdmin(Long targetId, Authentication authentication) {
        if (isAdmin(authentication)) {
            return;
        }
        Long currentId = currentUserId(authentication);
        if (currentId == null || !currentId.equals(targetId)) {
            throw new AccessDeniedException("You are not allowed to access this resource");
        }
    }
}
