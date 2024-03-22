--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10 (Homebrew)
-- Dumped by pg_dump version 14.10 (Homebrew)

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

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.ar_internal_metadata OWNER TO kentoiinuma;

--
-- Name: comment_likes; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.comment_likes (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    comment_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.comment_likes OWNER TO kentoiinuma;

--
-- Name: comment_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: kentoiinuma
--

CREATE SEQUENCE public.comment_likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comment_likes_id_seq OWNER TO kentoiinuma;

--
-- Name: comment_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kentoiinuma
--

ALTER SEQUENCE public.comment_likes_id_seq OWNED BY public.comment_likes.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    perception_group_id bigint NOT NULL,
    parent_comment_id integer,
    text text NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.comments OWNER TO kentoiinuma;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: kentoiinuma
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO kentoiinuma;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kentoiinuma
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: mbti_types; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.mbti_types (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    mbti_type integer NOT NULL,
    diagnosis_method integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.mbti_types OWNER TO kentoiinuma;

--
-- Name: mbti_types_id_seq; Type: SEQUENCE; Schema: public; Owner: kentoiinuma
--

CREATE SEQUENCE public.mbti_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mbti_types_id_seq OWNER TO kentoiinuma;

--
-- Name: mbti_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kentoiinuma
--

ALTER SEQUENCE public.mbti_types_id_seq OWNED BY public.mbti_types.id;


--
-- Name: media_works; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.media_works (
    id bigint NOT NULL,
    media_type integer NOT NULL,
    title character varying NOT NULL,
    genres integer,
    image character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    post_id bigint
);


ALTER TABLE public.media_works OWNER TO kentoiinuma;

--
-- Name: media_works_id_seq; Type: SEQUENCE; Schema: public; Owner: kentoiinuma
--

CREATE SEQUENCE public.media_works_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.media_works_id_seq OWNER TO kentoiinuma;

--
-- Name: media_works_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kentoiinuma
--

ALTER SEQUENCE public.media_works_id_seq OWNED BY public.media_works.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    post_id bigint NOT NULL,
    comment_id bigint NOT NULL,
    related_for_id integer NOT NULL,
    notification_type integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.notifications OWNER TO kentoiinuma;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: kentoiinuma
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO kentoiinuma;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kentoiinuma
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: perception_groups; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.perception_groups (
    id bigint NOT NULL,
    perception_group integer NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.perception_groups OWNER TO kentoiinuma;

--
-- Name: perception_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: kentoiinuma
--

CREATE SEQUENCE public.perception_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.perception_groups_id_seq OWNER TO kentoiinuma;

--
-- Name: perception_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kentoiinuma
--

ALTER SEQUENCE public.perception_groups_id_seq OWNED BY public.perception_groups.id;


--
-- Name: post_likes; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.post_likes (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    post_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.post_likes OWNER TO kentoiinuma;

--
-- Name: post_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: kentoiinuma
--

CREATE SEQUENCE public.post_likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_likes_id_seq OWNER TO kentoiinuma;

--
-- Name: post_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kentoiinuma
--

ALTER SEQUENCE public.post_likes_id_seq OWNED BY public.post_likes.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.posts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.posts OWNER TO kentoiinuma;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: kentoiinuma
--

CREATE SEQUENCE public.posts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO kentoiinuma;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kentoiinuma
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO kentoiinuma;

--
-- Name: users; Type: TABLE; Schema: public; Owner: kentoiinuma
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    clerk_id character varying NOT NULL,
    username character varying NOT NULL,
    avatar_url character varying NOT NULL
);


ALTER TABLE public.users OWNER TO kentoiinuma;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: kentoiinuma
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO kentoiinuma;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kentoiinuma
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: comment_likes id; Type: DEFAULT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.comment_likes ALTER COLUMN id SET DEFAULT nextval('public.comment_likes_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: mbti_types id; Type: DEFAULT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.mbti_types ALTER COLUMN id SET DEFAULT nextval('public.mbti_types_id_seq'::regclass);


--
-- Name: media_works id; Type: DEFAULT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.media_works ALTER COLUMN id SET DEFAULT nextval('public.media_works_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: perception_groups id; Type: DEFAULT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.perception_groups ALTER COLUMN id SET DEFAULT nextval('public.perception_groups_id_seq'::regclass);


--
-- Name: post_likes id; Type: DEFAULT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.post_likes ALTER COLUMN id SET DEFAULT nextval('public.post_likes_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: comment_likes comment_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT comment_likes_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: mbti_types mbti_types_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.mbti_types
    ADD CONSTRAINT mbti_types_pkey PRIMARY KEY (id);


--
-- Name: media_works media_works_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.media_works
    ADD CONSTRAINT media_works_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: perception_groups perception_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.perception_groups
    ADD CONSTRAINT perception_groups_pkey PRIMARY KEY (id);


--
-- Name: post_likes post_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_comment_likes_on_comment_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_comment_likes_on_comment_id ON public.comment_likes USING btree (comment_id);


--
-- Name: index_comment_likes_on_user_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_comment_likes_on_user_id ON public.comment_likes USING btree (user_id);


--
-- Name: index_comments_on_perception_group_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_comments_on_perception_group_id ON public.comments USING btree (perception_group_id);


--
-- Name: index_comments_on_user_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_comments_on_user_id ON public.comments USING btree (user_id);


--
-- Name: index_mbti_types_on_user_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_mbti_types_on_user_id ON public.mbti_types USING btree (user_id);


--
-- Name: index_notifications_on_comment_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_notifications_on_comment_id ON public.notifications USING btree (comment_id);


--
-- Name: index_notifications_on_post_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_notifications_on_post_id ON public.notifications USING btree (post_id);


--
-- Name: index_notifications_on_user_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_notifications_on_user_id ON public.notifications USING btree (user_id);


--
-- Name: index_post_likes_on_post_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_post_likes_on_post_id ON public.post_likes USING btree (post_id);


--
-- Name: index_post_likes_on_user_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_post_likes_on_user_id ON public.post_likes USING btree (user_id);


--
-- Name: index_posts_on_user_id; Type: INDEX; Schema: public; Owner: kentoiinuma
--

CREATE INDEX index_posts_on_user_id ON public.posts USING btree (user_id);


--
-- Name: comments fk_rails_02d339250d; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_rails_02d339250d FOREIGN KEY (perception_group_id) REFERENCES public.perception_groups(id);


--
-- Name: comments fk_rails_03de2dc08c; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk_rails_03de2dc08c FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: mbti_types fk_rails_42f2e11a27; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.mbti_types
    ADD CONSTRAINT fk_rails_42f2e11a27 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: media_works fk_rails_4f3dfcbb51; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.media_works
    ADD CONSTRAINT fk_rails_4f3dfcbb51 FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: posts fk_rails_5b5ddfd518; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT fk_rails_5b5ddfd518 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications fk_rails_9268535f02; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_rails_9268535f02 FOREIGN KEY (comment_id) REFERENCES public.comments(id);


--
-- Name: post_likes fk_rails_a04bfa7e81; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT fk_rails_a04bfa7e81 FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: notifications fk_rails_b080fb4855; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_rails_b080fb4855 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: comment_likes fk_rails_c28a479c60; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT fk_rails_c28a479c60 FOREIGN KEY (comment_id) REFERENCES public.comments(id);


--
-- Name: post_likes fk_rails_d07653f350; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT fk_rails_d07653f350 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: comment_likes fk_rails_efcc5b56dc; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.comment_likes
    ADD CONSTRAINT fk_rails_efcc5b56dc FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications fk_rails_ff8a02c41d; Type: FK CONSTRAINT; Schema: public; Owner: kentoiinuma
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_rails_ff8a02c41d FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- PostgreSQL database dump complete
--

