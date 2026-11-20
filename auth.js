
(function () {
    "use strict";

    const supabase = window.supabaseClient;

    if (!supabase) {
        console.error("Supabase client tidak ditemukan. Periksa supabase-config.js");
        return;
    }

    // ==========================================
    // LOGIN
    // ==========================================
    async function login(email, password) {
        try {

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });

            if (error) {
                return {
                    success: false,
                    message: error.message
                };
            }

            const profile = await getUserProfile(data.user.id);

            if (!profile || !profile.active) {

                await supabase.auth.signOut();

                return {
                    success: false,
                    message: "Akun tidak aktif atau profil pengguna tidak ditemukan."
                };
            }

            return {
                success: true,
                user: data.user,
                profile: profile
            };

        } catch (error) {

            return {
                success: false,
                message: error.message || "Terjadi kesalahan saat login."
            };

        }
    }


    // ==========================================
    // LOGIN ADMIN (ALIAS)
    // ==========================================
    async function loginAdmin(email, password) {
        return await login(email, password);
    }


    // ==========================================
    // LOGOUT
    // ==========================================
    async function logout() {

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Gagal logout:", error.message);
        }

        return {
            success: !error,
            message: error ? error.message : "Berhasil logout."
        };
    }


    // ==========================================
    // USER AKTIF
    // ==========================================
    async function getCurrentUser() {

        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
            return null;
        }

        return data.user;
    }


    // ==========================================
    // PROFILE USER
    // ==========================================
    async function getUserProfile(userId) {

        const { data, error } = await supabase
            .from("user_profiles")
            .select("id, display_name, role, active")
            .eq("id", userId)
            .maybeSingle();

        if (error) {
            console.error("Gagal mengambil profil:", error.message);
            return null;
        }

        return data;
    }


    // ==========================================
    // STATUS LOGIN
    // ==========================================
    async function getLoginStatus() {

        const { data, error } = await supabase.auth.getUser();

        if (error || !data.user) {
            return {
                loggedIn: false,
                user: null,
                profile: null
            };
        }

        const profile = await getUserProfile(data.user.id);

        if (!profile || !profile.active) {

            await supabase.auth.signOut();

            return {
                loggedIn: false,
                user: null,
                profile: null
            };
        }

        return {
            loggedIn: true,
            user: data.user,
            profile: profile
        };
    }


    // ==========================================
    // CEK ROLE
    // ==========================================
    async function checkRole(allowedRoles) {

        const status = await getLoginStatus();

        if (!status.loggedIn || !status.profile) {
            return false;
        }

        return allowedRoles.includes(status.profile.role);
    }


    // ==========================================
    // PROTEKSI ADMIN
    // ==========================================
    async function requireAdmin() {

        const allowedRoles = [
            "super_admin",
            "admin",
            "editor"
        ];

        const allowed = await checkRole(allowedRoles);

        if (!allowed) {
            window.location.href = "login.html";
            return false;
        }

        return true;
    }


    // ==========================================
    // PROTEKSI SUPER ADMIN
    // ==========================================
    async function requireSuperAdmin() {

        const allowed = await checkRole([
            "super_admin"
        ]);

        if (!allowed) {
            window.location.href = "login.html";
            return false;
        }

        return true;
    }


    // ==========================================
    // AUTH STATE
    // ==========================================
    supabase.auth.onAuthStateChange(function (event, session) {

        console.log("Auth event:", event);

        if (event === "SIGNED_OUT") {
            console.log("Pengguna telah logout.");
        }

        if (event === "SIGNED_IN" && session) {
            console.log("Pengguna berhasil masuk.");
        }

    });


    // ==========================================
    // EXPORT
    // ==========================================
    window.SMP7Auth = {

        login: login,
        loginAdmin: loginAdmin,
        logout: logout,

        getCurrentUser: getCurrentUser,
        getUserProfile: getUserProfile,
        getLoginStatus: getLoginStatus,

        checkRole: checkRole,
        requireAdmin: requireAdmin,
        requireSuperAdmin: requireSuperAdmin

    };

    console.log("SMP7Auth berhasil dimuat.");

})();
