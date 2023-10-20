
--INSERT PART DETAIL

INSERT INTO public.part_detail (
id, "questionCount", "createdAt", "updatedAt", "partId", "testId") VALUES (
'1'::integer, '6'::integer, '2023-10-08 23:06:27'::timestamp without time zone, '2023-10-08 23:06:27'::timestamp without time zone, '1'::integer, '1'::integer)
 returning id;
 
 INSERT INTO public.part_detail (
id, "questionCount", "createdAt", "updatedAt", "partId", "testId") VALUES (
'2'::integer, '25'::integer, '2023-10-08 23:06:27'::timestamp without time zone, '2023-10-08 23:06:27'::timestamp without time zone, '2'::integer, '1'::integer)
 returning id;
 
 INSERT INTO public.part_detail (
id, "questionCount", "createdAt", "updatedAt", "partId", "testId") VALUES (
'3'::integer, '39'::integer, '2023-10-08 23:06:27'::timestamp without time zone, '2023-10-08 23:06:27'::timestamp without time zone, '3'::integer, '1'::integer)
 returning id;
 
 INSERT INTO public.part_detail (
id, "questionCount", "createdAt", "updatedAt", "partId", "testId") VALUES (
'4'::integer, '30'::integer, '2023-10-08 23:06:27'::timestamp without time zone, '2023-10-08 23:06:27'::timestamp without time zone, '4'::integer, '1'::integer)
 returning id;
 
 INSERT INTO public.part_detail (
id, "questionCount", "createdAt", "updatedAt", "partId", "testId") VALUES (
'5'::integer, '30'::integer, '2023-10-08 23:06:27'::timestamp without time zone, '2023-10-08 23:06:27'::timestamp without time zone, '5'::integer, '1'::integer)
 returning id;
 
 INSERT INTO public.part_detail (
id, "questionCount", "createdAt", "updatedAt", "partId", "testId") VALUES (
'6'::integer, '16'::integer, '2023-10-08 23:06:27'::timestamp without time zone, '2023-10-08 23:06:27'::timestamp without time zone, '6'::integer, '1'::integer)
 returning id;

INSERT INTO public.part_detail (
id, "questionCount", "createdAt", "updatedAt", "partId", "testId") VALUES (
'7'::integer, '54'::integer, '2023-10-08 23:06:27'::timestamp without time zone, '2023-10-08 23:06:27'::timestamp without time zone, '7'::integer, '1'::integer)
 returning id;
 
 --INSERT QUESTION
 
 INSERT INTO public.question (
id, index, question, answer, "audioUrl", "A", "B", "C", "D", "createdAt", "updatedAt", "partDetailId") VALUES (
'4'::integer, '71'::character varying, 'What feature of a business does the speaker emphasize?'::character varying, 'D'::character varying, 'https://drive.google.com/file/d/1vQQHGk8EYavR6FeWP2i-rsdB-W0KT2UL/view?usp=sharing'::character varying, 'The quality of its food'::character varying, 'The extended hours it is open'::character varying, 'The style of its decor'::character varying, 'The affordable prices it offers'::character varying, '2023-10-08 23:06:27'::timestamp without time zone, '2023-10-08 23:06:27'::timestamp without time zone, '4'::integer)
 returning id;
 