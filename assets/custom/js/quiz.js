const QUESTIONS = [
    {
        label: 'What is your preferred method of learning new skills?',
        answers: [
            'I find online courses convenient and flexible.',
            'I prefer hands-on workshops for practical experience.',
            'I enjoy learning through reading for in-depth knowledge.',
        ],
    },
    {
        label: 'Which area of personal development are you most interested in right now?',
        answers: [
            'Improving time management skills: "Focused on better time management."',
            'Enhancing emotional intelligence: "Interested in developing emotional intelligence."',
            'Mastering a new programming language: "Learning a new programming language.',
        ],
    },
    {
        label: 'How do you usually stay informed about current events and trends?',
        answers: [
            'Social media platforms: "Stay updated through social media."',
            'News websites and apps: "Regularly visit news websites and use apps."',
            'Podcasts and webinars: "Keep up through podcasts and webinars."',
        ],
    },
    {
        label: 'What motivates you the most when pursuing a new goal?',
        answers: [
            'Achieving personal growth: "Motivated by personal growth."',
            'Financial rewards and stability: "Driven by financial rewards and stability."',
            'Making a positive impact on others: "Inspired by making a positive impact."',
        ],
    },
];

const $container = document.getElementById('container');

const startStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content">
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <img class="quiz-img" src="assets/custom/images/quiz.jpg">
                </div>
                <div class="col-lg-6 col-md-6 col-lg-6">
                    <h2 class="title">CryptoQuota</h2>
                    <h3>How do you choose the best stocks and coins to invest in by spending just 30 minutes a day analyzing the market?</h3>
                    <button class="btn btn-primary w-100 py-3 first-button" data-action="startQuiz">Get started</button>
                </div>
            </div>
        </div>
      `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'startQuiz') {
            quiz.nextStep(questionsStep);
        }
    },
};

const questionsStep = {
    questionIndex: 0,
    answers: {},
    render: () => {
        const question = QUESTIONS[questionsStep.questionIndex];

        $container.innerHTML = `
        <div class="container quiz-wrapper">

            <div class="row quiz-content text-center">
                <div class="question-wrapper">
                    <div class="row justify-content-center mt-4" style="width: 100%;">
                        <div class="progress col-md-6" style="padding-left: 0 !important; padding-right: 0 !important;">
                            <div class="progress-bar" style="width: ${questionsStep.getProgress()}%"></div>
                        </div>
                    </div>

                    <h3 class="question mt-4">${question.label}</h3>
                </div>

                <div class="row answers">
                    ${question.answers
                        .map(
                            (answer, index) =>
                                `
                                <button class="answer col-md-10 border rounded" data-action="selectAnswer" data-answer-index="${index}">
                                    ${answer}
                                </button>
                            `,
                        )
                        .join('')}
                </div>
            </div>
        </div>
      `;
    },
    getProgress: () =>
        Math.floor((questionsStep.questionIndex / QUESTIONS.length) * 100),
    onClick: (el) => {
        switch (el.getAttribute('data-action')) {
            case 'goToNextQuestion':
                return questionsStep.goToNextQuestion();
            case 'goToPreviousQuestion':
                return questionsStep.goToPreviousQuestion();
            case 'selectAnswer':
                return questionsStep.selectAnswer(
                    parseInt(el.getAttribute('data-answer-index'), 10),
                );
        }
    },
    goToPreviousQuestion: () => {
        questionsStep.questionIndex -= 1;
        questionsStep.render();
    },
    selectAnswer: (answerIndex) => {
        const question = QUESTIONS[questionsStep.questionIndex];
        const selectedAnswer = question.answers[answerIndex];

        questionsStep.answers = {
            ...questionsStep.answers,
            [question.label]: selectedAnswer,
        };

        if (questionsStep.isFinalQuestion()) {
            questionsStep.completeStep();
        } else {
            questionsStep.goToNextQuestion();
        }
    },
    isFinalQuestion: () => questionsStep.questionIndex === QUESTIONS.length - 1,
    goToNextQuestion: () => {
        questionsStep.questionIndex += 1;
        questionsStep.render();
    },
    completeStep: () => {
        quiz.setAnswers(questionsStep.answers);
        quiz.nextStep(finalStep);
    },
};

const finalStep = {
    render: () => {
        $container.innerHTML = `
        <div class="container quiz-wrapper">
            <div class="row quiz-content">
                <div class="col-lg-6 col-md-6 col-sm-12 form-block">
                    <h2 class="title">CryptoQuota</h2>
                    <h3 class="mb-4">Fill out the form to get free access to five of the most effective strategies in cryptocurrency trading.</h3>
                    <form>
                        <input class="form-control" name="name" type="name" placeholder="Name" required>
                        <input class="form-control" name="email" type="email" placeholder="Email" required>
                        <input class="form-control" name="phone" type="phone" placeholder="Phone" required>
                        
                        ${Object.keys(quiz.answers)
                            .map(
                                (question) =>
                                    `<input name="${question}" value="${quiz.answers[question]}" hidden>`,
                            )
                            .join('')}
                
                        <button data-action="submitAnswers" class="btn btn-primary w-100 py-3 first-button">Send</button>
                    </form>
                </div>
            </div>
        </div>
      `;
    },
    onClick: (el) => {
        if (el.getAttribute('data-action') === 'submitAnswers') {
            localStorage.setItem('quizDone', true);
            document.getElementById('main-page').classList.remove('hide');
            document.getElementById('quiz-page').classList.add('hide');
        }
    },
};

const quiz = {
    activeStep: startStep,
    answers: {},
    clear: () => ($container.innerHTML = ''),
    init: () => {
        $container.addEventListener('click', (event) =>
            quiz.activeStep.onClick(event.target),
        );
        $container.addEventListener('submit', (event) =>
            event.preventDefault(),
        );
    },
    render: () => {
        quiz.clear();
        quiz.activeStep.render();
    },
    nextStep: (step) => {
        quiz.activeStep = step;
        quiz.render();
    },
    setAnswers: (answers) => (quiz.answers = answers),
};

if (!localStorage.getItem('quizDone')) {
    document.getElementById('main-page').classList.add('hide');
    quiz.init();
    quiz.render();
}
