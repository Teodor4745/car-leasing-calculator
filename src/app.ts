interface LeasingDetails {
    totalCost: number;
    downPayment: number;
    monthlyInstallment: number;
    interestRate: number;
}

type CarType = "brandNew" | "used";

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
    const carTypeElement = document.getElementById("carType") as HTMLSelectElement;
    const carValueElement = document.getElementById("carValue") as HTMLInputElement;
    const carValueSliderElement = document.getElementById("carValueSlider") as HTMLInputElement;
    const leasePeriodElement = document.getElementById("leasePeriod") as HTMLInputElement;
    const leasePeriodSliderElement = document.getElementById("leasePeriodSlider") as HTMLInputElement;
    const downPaymentElement = document.getElementById("downPayment") as HTMLInputElement;
    const downPaymentSliderElement = document.getElementById("downPaymentSlider") as HTMLInputElement;

    const totalCostElement = document.getElementById("totalCost") as HTMLParagraphElement;
    const downPaymentAmountElement = document.getElementById("downPaymentAmount") as HTMLParagraphElement;
    const monthlyInstallmentElement = document.getElementById("monthlyInstallment") as HTMLParagraphElement;
    const interestRateElement = document.getElementById("interestRate") as HTMLParagraphElement;

    const setSliderValue = (slider: HTMLInputElement, value: number): void => {
        slider.value = value.toString();
    };

    const roundToStep = (value: number, step: number): number => {
        return Math.round(value / step) * step;
    };

    const validateInput = (input: HTMLInputElement, min: number, max: number, step?: number): void => {
        let value = parseFloat(input.value);
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        if (step !== undefined) {
            value = roundToStep(value, step);
        }
        input.value = value.toString();
    };

    const calculateLeasingDetails = (): LeasingDetails => {
        const carType: CarType = carTypeElement.value as CarType;
        const carValue: number = parseFloat(carValueElement.value);
        const leasePeriod: number = parseInt(leasePeriodElement.value);
        const downPaymentPercentage: number = parseFloat(downPaymentElement.value);

        const downPayment: number = (downPaymentPercentage / 100) * carValue;
        const amountToFinance: number = carValue - downPayment;
        const annualInterestRate: number = carType === "brandNew" ? BRAND_NEW_CAR_INTEREST_RATE : USED_CAR_INTEREST_RATE;

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

    const updateLeasingDetails = (): void => {
        const details: LeasingDetails = calculateLeasingDetails();

        totalCostElement.textContent = `Total Leasing Cost: €${details.totalCost.toFixed(2)}`;
        downPaymentAmountElement.textContent = `Down Payment: €${details.downPayment.toFixed(2)}`;
        monthlyInstallmentElement.textContent = `Monthly Installment: €${details.monthlyInstallment.toFixed(2)}`;
        interestRateElement.textContent = `Interest Rate: ${details.interestRate}%`;
    };

    const handleInputChange = (input: HTMLInputElement, slider: HTMLInputElement, min: number, max: number, step?: number): void => {
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

