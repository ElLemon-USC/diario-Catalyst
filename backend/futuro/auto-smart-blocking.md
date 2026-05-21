# Bloqueo automático inteligente

//backend
//backend/src/controllers/diary.controller.js
// const lowerContent = content.toLowerCase();

```js
const calculateRiskScore = (user, content, attempts) => {
  let score = 0;
  const lower = content.toLowerCase();
  if (lower.includes("hack")) score += 3;
  if (lower.includes("virus")) score += 3;
  if (lower.includes("spam")) score += 2;
  score += attempts * 1;
  return score;
};

const score = calculateRiskScore(user, content, user.IntentosFallidos);
if (score >= 5) {
  user.blockedUntil = new Date(Date.now() + 60 * 1000);
  await user.save();
  return res.status(400).json({ message: "Usuario bloqueado automáticamente por riesgo" });
}
```

//backend
//backend/src/models/user.model.js
// BloquearHasta: { type: Date, default: null },

```js
riskScore: {
  type: Number,
  default: 0
},
autoBlockReason: {
  type: String,
  default: null
},
```

---

## Frontend

//fronted
//fronted/src/components/DiaryEditor.vue
// <textarea :value="text"

```js
<div v-if="riskScore > 0" class="risk-score">
   Nivel de riesgo: {{ riskScore }}/10
</div>

<textarea
  :value="text"
  @input="calculateRiskScore"
  :style="{ fontFamily: fontFamily }"
  placeholder="Escribe tu pensamiento..."
></textarea>
```

//fronted
//fronted/src/views/diaryForm.vue
// const lowerContent = content.toLowerCase();

```js
const calculateRiskScore = () => {
  let score = 0;
  const lower = text.value.toLowerCase();
  if (lower.includes("hack")) score += 3;
  if (lower.includes("virus")) score += 3;
  if (lower.includes("spam")) score += 2;
  riskScore.value = Math.min(score, 10);
};
```
