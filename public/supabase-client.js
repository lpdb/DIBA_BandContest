import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://xsvdiyjoqnyfyhxcnpgq.supabase.co';
const supabaseKey = 'sb_publishable_OqbLUWOeRooUK5hPhu4vaQ_R8aZrh3q';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Funzione helper per verificare se l'utente è autenticato
export async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Funzione helper per ottenere il profilo utente
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('profili_utenti')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Errore recupero profilo:', error);
        return null;
    }

    return data;
}

// Funzione helper per il logout
export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = 'index.html';
    }
    return error;
}

// Funzione per verificare se l'utente è admin
export async function isAdmin() {
    const user = await checkAuth();
    if (!user) return false;

    const profile = await getUserProfile(user.id);
    return profile && profile.ruolo === 'admin';
}

// Funzione per verificare se le votazioni sono chiuse
export async function areVotingsClosed() {
    const { data, error } = await supabase
        .from('stato_votazioni')
        .select('votazioni_chiuse')
        .eq('id', 1)
        .single();

    if (error) {
        console.error('Errore verifica stato votazioni:', error);
        return false;
    }

    return data.votazioni_chiuse;
}
