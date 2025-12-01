SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.content_admin (
    username character varying(60) NOT NULL,
    password character(60) NOT NULL
);

ALTER TABLE public.content_admin OWNER TO postgres;

CREATE TABLE public.content_entry (
    content_id bigint NOT NULL,
    content_level smallint NOT NULL,
    content_link character varying(500) NOT NULL
);

ALTER TABLE public.content_entry OWNER TO postgres;

CREATE SEQUENCE public.content_entry_content_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.content_entry_content_id_seq OWNER TO postgres;

ALTER SEQUENCE public.content_entry_content_id_seq OWNED BY public.content_entry.content_id;

ALTER TABLE ONLY public.content_entry ALTER COLUMN content_id SET DEFAULT nextval('public.content_entry_content_id_seq'::regclass);

INSERT INTO public.content_admin (username, password) VALUES ('admin','$2a$10$wpP92TQWkWgcoY7OmsaMVepcPCs6TwB6Cchd3gLZSIjRrl742G5Pu');

ALTER TABLE ONLY public.content_admin
    ADD CONSTRAINT content_admin_pkey PRIMARY KEY (username);

ALTER TABLE ONLY public.content_entry
    ADD CONSTRAINT content_entry_pkey PRIMARY KEY (content_id);