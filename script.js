document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const allInputs = document.querySelectorAll('.number-input');
    
    // Add input validation
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = '';
            } else if (value > 90) {
                this.value = '90';
            }
        });
    });
    
    // Generate prediction
    generateBtn.addEventListener('click', function() {
        // Collect all input values
        const ritardatariAssoluti = getInputValues('.ritardatari-assoluti');
        const ritardatari10eLotto = getInputValues('.ritardatari-10elotto');
        const frequenti10eLotto = getInputValues('.frequenti-10elotto');
        const ritardatariOro = getInputValues('.ritardatari-oro');
        const ritardatariExtra = getInputValues('.ritardatari-extra');
        
        // Generate predictions
        generatePredictions(
            ritardatariAssoluti,
            ritardatari10eLotto,
            frequenti10eLotto,
            ritardatariOro,
            ritardatariExtra
        );
    });
    
    // Reset all inputs
    resetBtn.addEventListener('click', function() {
        allInputs.forEach(input => {
            input.value = '';
        });
        
        // Clear predictions
        document.querySelectorAll('.prediction-numbers').forEach(div => {
            div.innerHTML = '';
        });
    });
    
    // Helper function to get input values
    function getInputValues(selector) {
        const inputs = document.querySelectorAll(selector);
        const values = [];
        
        inputs.forEach(input => {
            const value = parseInt(input.value);
            if (!isNaN(value) && value >= 1 && value <= 90) {
                values.push(value);
            }
        });
        
        return values;
    }
    
    // Generate predictions based on inputs
    function generatePredictions(ritardatariAssoluti, ritardatari10eLotto, frequenti10eLotto, ritardatariOro, ritardatariExtra) {
        // Create a pool of all available numbers (1-90)
        const allNumbers = Array.from({length: 90}, (_, i) => i + 1);
        
        // Create a weighted pool based on input values
        const weightedPool = createWeightedPool(
            allNumbers,
            ritardatariAssoluti,
            ritardatari10eLotto,
            frequenti10eLotto,
            ritardatariOro,
            ritardatariExtra
        );
        
        // Generate predictions for each group
        const prediction1 = generateUniqueNumbers(weightedPool, 4); // 3 numbers + gold
        const prediction2 = generateUniqueNumbers(weightedPool, 3);
        const prediction3 = generateUniqueNumbers(weightedPool, 3);
        const prediction4 = generateUniqueNumbers(weightedPool, 1);
        const prediction5 = generateUniqueNumbers(weightedPool, 2);
        const prediction6 = generateUniqueNumbers(weightedPool, 2);
        const luckyNumber = Math.floor(Math.random() * 90) + 1;
        
        // Display predictions
        displayPrediction('prediction1', prediction1.slice(0, 3), prediction1[3]);
        displayPrediction('prediction2', prediction2);
        displayPrediction('prediction3', prediction3);
        displayPrediction('prediction4', prediction4);
        displayPrediction('prediction5', prediction5);
        displayPrediction('prediction6', prediction6);
        displayPrediction('lucky-number', [luckyNumber]);
    }
    
    // Create a weighted pool based on input values
    function createWeightedPool(allNumbers, ritardatariAssoluti, ritardatari10eLotto, frequenti10eLotto, ritardatariOro, ritardatariExtra) {
        const weightedPool = [];
        
        // Add all numbers to the pool
        allNumbers.forEach(num => {
            // Base weight
            let weight = 1;
            
            // Increase weight based on input categories
            if (ritardatariAssoluti.includes(num)) weight += 3;
            if (ritardatari10eLotto.includes(num)) weight += 2;
            if (frequenti10eLotto.includes(num)) weight += 4;
            if (ritardatariOro.includes(num)) weight += 3;
            if (ritardatariExtra.includes(num)) weight += 2;
            
            // Add the number to the pool based on its weight
            for (let i = 0; i < weight; i++) {
                weightedPool.push(num);
            }
        });
        
        return weightedPool;
    }
    
    // Generate unique random numbers from the weighted pool
    function generateUniqueNumbers(pool, count) {
        const result = [];
        const tempPool = [...pool];
        
        for (let i = 0; i < count; i++) {
            if (tempPool.length === 0) break;
            
            const randomIndex = Math.floor(Math.random() * tempPool.length);
            const selectedNumber = tempPool[randomIndex];
            
            // Add to result if not already included
            if (!result.includes(selectedNumber)) {
                result.push(selectedNumber);
            } else {
                // Try again if we got a duplicate
                i--;
            }
            
            // Remove all instances of this number from the pool to avoid duplicates
            for (let j = tempPool.length - 1; j >= 0; j--) {
                if (tempPool[j] === selectedNumber) {
                    tempPool.splice(j, 1);
                }
            }
        }
        
        return result;
    }
    
    // Display prediction in the UI
    function displayPrediction(elementId, numbers, goldNumber = null) {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        
        numbers.forEach(num => {
            const ball = document.createElement('div');
            ball.className = 'number-ball';
            ball.textContent = num;
            container.appendChild(ball);
        });
        
        if (goldNumber !== null) {
            const goldBall = document.createElement('div');
            goldBall.className = 'number-ball gold-number';
            goldBall.textContent = goldNumber;
            container.appendChild(goldBall);
        }
    }
});