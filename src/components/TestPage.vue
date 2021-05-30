<template>
  <v-container>
    <h1 class="title-page">{{ quizData.name }}</h1>
    <div v-if="quizData && quizData.questions && !seeResults">
      <div v-for="(question, index) in quizData.questions" :key="index">
        <label>{{ question.question }}</label>
        <v-radio-group column :mandatory="true" v-model="answers[index]">
          <v-radio
            color="#a25b03"
            :label="answer.answer"
            :value="index2"
            v-for="(answer, index2) in question.answers"
            :key="index2"
          >
          </v-radio>
        </v-radio-group>
      </div>
      <v-btn
        class="button-class"
        @click="calculateResults()"
        v-if="showCalculateResultsButton"
      >
        See result
      </v-btn>
    </div>

    <!-- progress donut to be implemented -->
    <div v-if="seeResults === true">
      <div class="header-results">
        <v-progress-circular
          :rotate="360"
          :size="100"
          :width="15"
          :value="resultPercentage"
          color="orange"
        >
          {{ resultPercentage }}
        </v-progress-circular>
        Correct questions: {{ correctQuestions }}
      </div>
      <div>
        <div v-for="(question, index3) in wrongQuestions" :key="index3">
          <div class="question">
            {{ quizData.questions[question[0]].question }}
          </div>
          <div class="error-color">
            {{ quizData.questions[question[0]].answers[question[1]].answer }}
          </div>
          <div class="success-color">
            {{ getCorrectAnswerForQuestion(question[0]) }}
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "TestPage",
  data() {
    return {
      id: this.$route.params.id,
      actualChapter: null,
      seeResults: false,
      chapterNumber: 0,
      showQuiz: true,
      correctQuestions: 0,
      answers: [],
      wrongQuestions: [],
      resultPercentage: 0,
    };
  },
  computed: {
    quizData() {
      return this.$store.getters.quizezData.filter(
        (item) => item.key === this.id
      )[0];
    },
    showCalculateResultsButton() {
      return this.showQuiz === true && this.seeResults === false;
    },
  },
  methods: {
    getCorrectAnswerForQuestion(questionNumber) {
      return this.quizData.questions[questionNumber].answers.filter(
        (answer) => answer.correct === true
      )[0].answer;
    },
    calculateResults() {
      let correct = 0;
      let wrong = [];
      this.answers.forEach((answer, indexQuestion) => {
        if (
          this.quizData.questions[indexQuestion].answers[answer].correct ===
          true
        ) {
          correct = correct + 1;
        } else {
          wrong.push([indexQuestion, answer]);
        }
      });
      this.correctQuestions = correct;
      this.wrongQuestions = wrong;
      this.seeResults = true;
      this.resultPercentage = Math.round(
        (correct / this.quizData.questions.length) * 100
      );
    },
  },
};
</script>
<style scoped>
.question {
  margin-top: 10px;
}
.header-results {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 20px 0;
}
.v-progress-circular {
  margin-bottom: 15px;
}
.show-questions {
  background-color: #170a3a;
}
.error-color {
  color: red;
}
.success-color {
  color: green;
}
.button-class {
  background-color: var(--primary) !important;
  color: var(--light-text);
  margin: 20px 0;
}
.title-page {
  font-family: "dancingscript" !important;
  padding-bottom: 10px;
  font-weight: bold;
}
</style>
