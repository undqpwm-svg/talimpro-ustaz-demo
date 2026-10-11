<?php
/**
 * Демо-данные для WordPress Playground: тестовый курс, уроки и тестовые слушатели.
 * Запускается шагом runPHP из playground/blueprint-*.json. На рабочий сайт не выкладывается.
 */

require_once '/wordpress/wp-load.php';

update_option( 'tutor_wizard', 'active' );
update_option( 'blogname', 'talim.pro — демо' );
update_option( 'blogdescription', 'Демо-копия с тестовыми данными' );
update_option( 'permalink_structure', '/%postname%/' );

// ---------- Тестовые пользователи ----------

function talim_demo_user( $login, $first, $last, $patronymic ) {
	$user = get_user_by( 'login', $login );
	$id   = $user ? $user->ID : wp_insert_user(
		array(
			'user_login'   => $login,
			'user_pass'    => $login,
			'user_email'   => $login . '@example.com',
			'first_name'   => $first,
			'last_name'    => $last,
			'display_name' => $first . ' ' . $last,
			'role'         => 'subscriber',
		)
	);
	update_user_meta( $id, '_patronymic', $patronymic );
	return $id;
}

$student  = talim_demo_user( 'student', 'Слушатель', 'Тестовый', 'Демович' );
$graduate = talim_demo_user( 'graduate', 'Выпускник', 'Тестовый', 'Демович' );

// ---------- Курс, тема, уроки ----------

$course_id = wp_insert_post(
	array(
		'post_type'    => tutor()->course_post_type,
		'post_status'  => 'publish',
		'post_name'    => 'proforientaciya-demo',
		'post_title'   => 'Организация профориентации в образовательных учреждениях (демо)',
		'post_content' => 'Демо-курс для проверки доработок: контроль просмотра видео и выдача сертификата.',
		'post_author'  => 1,
	)
);
update_post_meta( $course_id, '_tutor_course_price_type', 'free' );

$topic_id = wp_insert_post(
	array(
		'post_type'   => 'topics',
		'post_status' => 'publish',
		'post_title'  => 'Модуль 1. Основы профориентации',
		'post_parent' => $course_id,
		'menu_order'  => 1,
		'post_author' => 1,
	)
);

$lesson_video = wp_insert_post(
	array(
		'post_type'    => tutor()->lesson_post_type,
		'post_status'  => 'publish',
		'post_name'    => 'video-urok',
		'post_title'   => 'Урок 1. Видеоурок (Vimeo)',
		'post_content' => 'Кнопка «Отметить как завершенный» станет активной, когда вы посмотрите не менее 90% видео. Перемотка не засчитывается.',
		'post_parent'  => $topic_id,
		'menu_order'   => 1,
		'post_author'  => 1,
	)
);
update_post_meta(
	$lesson_video,
	'_video',
	array(
		'source'       => 'vimeo',
		'source_vimeo' => 'https://vimeo.com/76979871',
	)
);

$lesson_text = wp_insert_post(
	array(
		'post_type'    => tutor()->lesson_post_type,
		'post_status'  => 'publish',
		'post_name'    => 'prakticheskoe-zadanie',
		'post_title'   => 'Урок 2. Практическое задание (без видео)',
		'post_content' => 'Урок без видео — его можно завершить сразу.',
		'post_parent'  => $topic_id,
		'menu_order'   => 2,
		'post_author'  => 1,
	)
);

// ---------- Запись на курс ----------

tutor_utils()->do_enroll( $course_id, 0, $student );
tutor_utils()->do_enroll( $course_id, 0, $graduate );

// Выпускник прошёл курс — для демонстрации выдачи сертификата
foreach ( array( $lesson_video, $lesson_text ) as $lesson ) {
	update_user_meta( $graduate, '_tutor_completed_lesson_id_' . $lesson, tutor_time() );
}
\Tutor\Models\CourseModel::mark_course_as_completed( $course_id, $graduate );

update_option( 'talim_demo_course_id', $course_id );
flush_rewrite_rules();
