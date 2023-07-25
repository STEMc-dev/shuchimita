// import { createClient } from "@supabase/supabase-js";
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const createSupabaseClient = () => {
	return createClient(supabaseUrl, supabaseAnonKey);
};

module.exports = createSupabaseClient;
