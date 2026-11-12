document.addEventListener('DOMContentLoaded', () => {
    const goalSelect = document.getElementById('goal-select');
    const suggestionBtn = document.getElementById('get-suggestion-btn');
    const suggestionOutput = document.getElementById('suggestion-output');

    const recordFood = document.getElementById('record-food');
    const recordCal = document.getElementById('record-cal');
    const saveRecordBtn = document.getElementById('save-record-btn');
    const editIndexInput = document.getElementById('edit-index');
    const recordList = document.getElementById('record-list');
    const totalCalculation = document.getElementById('total-calculation');
    const crudFeedback = document.getElementById('crud-feedback');
    const formHeading = document.getElementById('form-heading');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    // Load data from Local Storage (Task 5)
    let foodRecords = JSON.parse(localStorage.getItem('nutrition_records')) || [];

    // --- TASK 3: IMPLEMENT SUGGESTION LOGIC (Control Statements) ---
    // --- TASK 3: ENHANCED SUGGESTION LOGIC ---
    const suggestionContainer = document.getElementById('suggestion-container');
    const suggestionTitle = document.getElementById('suggestion-title');
    const suggestionTag = document.getElementById('suggestion-tag');
    const suggestionDesc = document.getElementById('suggestion-desc');
    const macroProtein = document.getElementById('macro-protein');
    const macroCarbs = document.getElementById('macro-carbs');
    const macroFats = document.getElementById('macro-fats');
    const foodTags = document.getElementById('food-tags');

    suggestionBtn.addEventListener('click', () => {
        const goal = goalSelect.value;
        let details = {};

        // Control Statements (Switch Case)
        switch (goal) {
            case 'weight-loss':
                details = {
                    title: '🥗 Caloric Deficit & High Fiber',
                    tag: 'Fat Loss',
                    desc: 'Focus on nutrient-dense foods that keep you full longer while keeping total daily calorie intake low.',
                    protein: '35%',
                    carbs: '40%',
                    fats: '25%',
                    foods: ['🍎 Apples', '🥗 Green Salad', '🥣 Oatmeal', '🐔 Chicken Breast', '🥚 Egg Whites']
                };
                break;

            case 'muscle-gain':
                details = {
                    title: '💪 High Protein & Surplus Energy',
                    tag: 'Hypertrophy',
                    desc: 'Prioritize lean proteins and quality complex carbohydrates to fuel strength workouts and promote muscle recovery.',
                    protein: '40%',
                    carbs: '45%',
                    fats: '15%',
                    foods: ['🥩 Lean Beef', '🍗 Chicken Breast', '🥚 Whole Eggs', '🍠 Sweet Potato', '🧀 Tofu']
                };
                break;

            case 'maintenance':
                details = {
                    title: '⚖️ Balanced Macro Ratio',
                    tag: 'Healthy Living',
                    desc: 'Maintain steady energy levels and overall wellbeing with a balanced mix of whole foods and good hydration.',
                    protein: '30%',
                    carbs: '50%',
                    fats: '20%',
                    foods: ['🐟 Salmon', '🥑 Avocado', '🌾 Brown Rice', '🍌 Banana', '🥦 Broccoli']
                };
                break;
        }

        // Render data ke DOM
        suggestionTitle.textContent = details.title;
        suggestionTag.textContent = details.tag;
        suggestionDesc.textContent = details.desc;
        macroProtein.textContent = details.protein;
        macroCarbs.textContent = details.carbs;
        macroFats.textContent = details.fats;

        // Render food tag
        foodTags.innerHTML = details.foods.map(item => 
            `<span style="background: #faf7f2; color: #5c4033; font-size: 12px; padding: 5px 12px; border-radius: 20px; border: 1px solid #e8e0d5; font-weight: 600;">${item}</span>`
        ).join('');

        // Tunjukkan kad
        suggestionContainer.style.display = 'block';
    });

    // --- TASK 4 & 5: CRUD & MEANINGFUL CALCULATION ---
    function renderRecords() {
        recordList.innerHTML = '';
        let totalCalories = 0;

        if (foodRecords.length === 0) {
            recordList.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">No records saved yet.</p>';
            totalCalculation.textContent = '📊 Total Daily Calorie Intake: 0 kcal';
            return;
        }

        foodRecords.forEach((record, index) => {
            totalCalories += Number(record.calories);

            const li = document.createElement('li');
            li.innerHTML = `
                <span><strong>${record.foodName}</strong> — ${record.calories} kcal</span>
                <div>
                    <button onclick="window.editRecord(${index})" style="background-color: #2980b9; padding: 6px 12px; font-size: 12px; margin-right: 5px;">Edit</button>
                    <button class="danger-btn" onclick="window.deleteRecord(${index})" style="padding: 6px 12px; font-size: 12px;">Delete</button>
                </div>
            `;
            recordList.appendChild(li);
        });

        // Task 4: Meaningful calculation with clear labels and units
        totalCalculation.textContent = `📊 Total Daily Calorie Intake: ${totalCalories} kcal`;

        // Save persistence to Local Storage (Task 5)
        localStorage.setItem('nutrition_records', JSON.stringify(foodRecords));
    }

    // CREATE & UPDATE (Save Operation)
    saveRecordBtn.addEventListener('click', () => {
        const name = recordFood.value.trim();
        const cal = recordCal.value.trim();
        const editIndex = parseInt(editIndexInput.value);

        // Input Validation (Task 5 & 6)
        if (!name || !cal) {
            crudFeedback.textContent = '⚠️ Please fill in both the food name and calorie amount!';
            crudFeedback.style.color = '#b71c1c';
            return;
        }

        if (isNaN(cal) || Number(cal) <= 0) {
            crudFeedback.textContent = '⚠️ Please enter a valid positive number for calories!';
            crudFeedback.style.color = '#b71c1c';
            return;
        }

        if (editIndex === -1) {
            // CREATE operation
            foodRecords.push({ foodName: name, calories: cal });
            crudFeedback.textContent = '✅ Food intake record successfully created!';
        } else {
            // UPDATE operation
            foodRecords[editIndex] = { foodName: name, calories: cal };
            crudFeedback.textContent = '✅ Record successfully updated!';
            window.resetForm();
        }

        crudFeedback.style.color = '#27ae60';
        recordFood.value = '';
        recordCal.value = '';
        renderRecords();
    });

    // EDIT helper (READ / Prepare Update)
    window.editRecord = function(index) {
        const record = foodRecords[index];
        recordFood.value = record.foodName;
        recordCal.value = record.calories;
        editIndexInput.value = index;
        formHeading.textContent = '✏️ Update Food Record';
        saveRecordBtn.textContent = 'Update Record';
        cancelEditBtn.style.display = 'inline-block';
        crudFeedback.textContent = '';
    };

    window.resetForm = function() {
        recordFood.value = '';
        recordCal.value = '';
        editIndexInput.value = '-1';
        formHeading.textContent = '📝 Add Food Intake Record';
        saveRecordBtn.textContent = 'Save Record';
        cancelEditBtn.style.display = 'none';
        crudFeedback.textContent = '';
    };

    // DELETE operation (Task 5)
    window.deleteRecord = function(index) {
        if (confirm('Are you sure you want to delete this record?')) {
            foodRecords.splice(index, 1);
            renderRecords();
            crudFeedback.textContent = '🗑️ Record has been successfully deleted.';
            crudFeedback.style.color = '#c0392b';
        }
    };

    renderRecords();
});