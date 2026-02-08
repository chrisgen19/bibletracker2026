--
-- PostgreSQL database dump
--


-- Dumped from database version 18.0 (Debian 18.0-1.pgdg13+3)
-- Dumped by pg_dump version 18.0 (Debian 18.0-1.pgdg13+3)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER',
    'PREFER_NOT_TO_SAY'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id text NOT NULL,
    user_id text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    provider_account_id text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    session_token text NOT NULL,
    user_id text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    email_verified timestamp(3) without time zone,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    username text,
    birthday timestamp(3) without time zone NOT NULL,
    gender public."Gender" NOT NULL,
    phone_number text,
    country text NOT NULL,
    image text,
    terms_accepted boolean DEFAULT false NOT NULL,
    terms_accepted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_tokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
5ca047d5-79b8-4710-a957-ddc6b7c98fca	edd9f9f550df9375a760e646350a36d3b8038ea9ae526f2ec54493f95ae9a2da	2026-02-08 09:24:19.500962+00	20260208092419_init	\N	\N	2026-02-08 09:24:19.491658+00	1
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, session_token, user_id, expires) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, email_verified, password, first_name, last_name, username, birthday, gender, phone_number, country, image, terms_accepted, terms_accepted_at, created_at, updated_at) FROM stdin;
01KGY94T01QM8BAW9Z760DAQTE	chrisgen19@gmail.com	\N	$2b$12$OoQBKRMmoHI/CfbHvucTjumMaHFd/gYhp.glxw5hY/rDwcmpceXvS	Christian Genesis	Diomampo	chrisgen19	1988-07-19 00:00:00	MALE	09765491616	PH	\N	t	2026-02-08 09:25:53.795	2026-02-08 09:25:53.799	2026-02-08 09:25:53.799
\.


--
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verification_tokens (identifier, token, expires) FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts_provider_provider_account_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX accounts_provider_provider_account_id_key ON public.accounts USING btree (provider, provider_account_id);


--
-- Name: sessions_session_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sessions_session_token_key ON public.sessions USING btree (session_token);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: verification_tokens_identifier_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX verification_tokens_identifier_token_key ON public.verification_tokens USING btree (identifier, token);


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict gBx8G4XoFU4wZd1kZaFkuwbkMpdjUcGxMekqgjJ0EcTUBq1r0WibBFtbUoLEldF

