"use strict";
const MIN_CAR_VALUE = 10000;
const MAX_CAR_VALUE = 200000;
const MIN_LEASE_PERIOD = 24;
const MAX_LEASE_PERIOD = 72;
const LEASE_PERIOD_STEP = 12;
const MIN_DOWN_PAYMENT_PERCENTAGE = 10;
const MAX_DOWN_PAYMENT_PERCENTAGE = 50;
const DOWN_PAYMENT_STEP = 5;
const BRAND_NEW_CAR_INTEREST_RATE = 2.99;
const USED_CAR_INTEREST_RATE = 3.7;
document.addEventListener("DOMContentLoaded", () => {
    const carTypeElement = document.getElementById("carType");
    const carValueElement = document.getElementById("carValue");
    const carValueSliderElement = document.getElementById("carValueSlider");
    const leasePeriodElement = document.getElementById("leasePeriod");
    const leasePeriodSliderElement = document.getElementById("leasePeriodSlider");
    const downPaymentElement = document.getElementById("downPayment");
    const downPaymentSliderElement = document.getElementById("downPaymentSlider");
    const totalCostElement = document.getElementById("totalCost");
    const downPaymentAmountElement = document.getElementById("downPaymentAmount");
    const monthlyInstallmentElement = document.getElementById("monthlyInstallment");
    const interestRateElement = document.getElementById("interestRate");
    const setSliderValue = (slider, value) => {
        slider.value = value.toString();
    };
    const roundToStep = (value, step) => {
        return Math.round(value / step) * step;
    };
    const validateInput = (input, min, max, step) => {
        let value = parseFloat(input.value);
        if (value < min) {
            value = min;
        }
        else if (value > max) {
            value = max;
        }
        if (step !== undefined) {
            value = roundToStep(value, step);
        }
        input.value = value.toString();
    };
    const calculateLeasingDetails = () => {
        const carType = carTypeElement.value;
        const carValue = parseFloat(carValueElement.value);
        const leasePeriod = parseInt(leasePeriodElement.value);
        const downPaymentPercentage = parseFloat(downPaymentElement.value);
        const downPayment = (downPaymentPercentage / 100) * carValue;
        const amountToFinance = carValue - downPayment;
        const annualInterestRate = carType === "brandNew" ? BRAND_NEW_CAR_INTEREST_RATE : USED_CAR_INTEREST_RATE;
        const monthlyInterestRate = annualInterestRate / 100 / 12;
        const numberOfPayments = leasePeriod;
        const numerator = amountToFinance * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
        const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
        const monthlyPayment = numerator / denominator;
        const totalCost = monthlyPayment * leasePeriod + downPayment;
        return {
            totalCost,
            downPayment,
            monthlyInstallment: monthlyPayment,
            interestRate: annualInterestRate
        };
    };
    const updateLeasingDetails = () => {
        const details = calculateLeasingDetails();
        totalCostElement.textContent = `Total Leasing Cost: €${details.totalCost.toFixed(2)}`;
        downPaymentAmountElement.textContent = `Down Payment: €${details.downPayment.toFixed(2)}`;
        monthlyInstallmentElement.textContent = `Monthly Installment: €${details.monthlyInstallment.toFixed(2)}`;
        interestRateElement.textContent = `Interest Rate: ${details.interestRate}%`;
    };
    const handleInputChange = (input, slider, min, max, step) => {
        input.addEventListener("blur", () => {
            validateInput(input, min, max, step);
            slider.value = input.value;
            setSliderValue(slider, parseFloat(input.value));
            updateLeasingDetails();
        });
        input.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                validateInput(input, min, max, step);
                slider.value = input.value;
                setSliderValue(slider, parseFloat(input.value));
                updateLeasingDetails();
                input.blur();
            }
        });
    };
    carTypeElement.addEventListener("change", updateLeasingDetails);
    handleInputChange(carValueElement, carValueSliderElement, MIN_CAR_VALUE, MAX_CAR_VALUE);
    handleInputChange(leasePeriodElement, leasePeriodSliderElement, MIN_LEASE_PERIOD, MAX_LEASE_PERIOD, LEASE_PERIOD_STEP);
    handleInputChange(downPaymentElement, downPaymentSliderElement, MIN_DOWN_PAYMENT_PERCENTAGE, MAX_DOWN_PAYMENT_PERCENTAGE, DOWN_PAYMENT_STEP);
    carValueSliderElement.addEventListener("input", () => {
        carValueElement.value = carValueSliderElement.value;
        updateLeasingDetails();
    });
    leasePeriodSliderElement.addEventListener("input", () => {
        leasePeriodElement.value = leasePeriodSliderElement.value;
        updateLeasingDetails();
    });
    downPaymentSliderElement.addEventListener("input", () => {
        downPaymentElement.value = downPaymentSliderElement.value;
        updateLeasingDetails();
    });
    setSliderValue(carValueSliderElement, parseFloat(carValueElement.value));
    setSliderValue(leasePeriodSliderElement, parseFloat(leasePeriodElement.value));
    setSliderValue(downPaymentSliderElement, parseFloat(downPaymentElement.value));
    updateLeasingDetails();
});
