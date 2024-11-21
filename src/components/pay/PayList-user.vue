<template>
    <div class="pay-list">
        <h2>급여 목록</h2>
        <div class="header">
            <div class="search-filter-container">
                <select v-model="selectedStartYearMonth" @change="fetchPayData" class="filter-select">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
                <select v-model="selectedStartMonth" @change="fetchPayData" class="filter-select">
                    <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>
                -
                <select v-model="selectedEndYearMonth" @change="fetchPayData" class="filter-select">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
                <select v-model="selectedEndMonth" @change="fetchPayData" class="filter-select">
                    <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                </select>
            </div>
        </div>

        <div class="table-container">
            <table border="1">
                <thead>
                    <tr>
                        <th>날짜</th>
                        <th>기본급</th>
                        <th>지급 총액</th>
                        <th>소득세</th>
                        <th>국민연금</th>
                        <th>건강보험</th>
                        <th>고용보험</th>
                        <th>공제총액</th>
                        <th>야간수당</th>
                        <th>보너스</th>
                        <th>지방소득세</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pay in payData" :key="pay.payId">
                        <td>{{ pay.formattedMonth }}</td>
                        <td>{{ pay.baseSalary }}</td>
                        <td>{{ pay.overtimePay }}</td>
                        <td>{{ pay.totalAmount }}</td>
                        <td>{{ pay.incomeTax }}</td>
                        <td>{{ pay.nationalPension }}</td>
                        <td>{{ pay.healthInsurance }}</td>
                        <td>{{ pay.employmentInsurance }}</td>
                        <td>{{ pay.deductionsTotal }}</td>
                        <td>{{ pay.bonus }}</td>
                        <td>{{ pay.localIncomeTax }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination -->
        <div class="pagination">
            <button class="pagination-arrow" :disabled="currentPage === 0" @click="handlePageChange(currentPage - 1)">
                < </button>
                    <span v-for="page in totalPages" :key="page" :class="{
                        'pagination-page': true,
                        'active': page === currentPage + 1
                    }" @click="handlePageChange(page - 1)">
                        {{ page }}
                    </span>

                    <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage >= totalPages - 1"
                        class="pagination-arrow">
                        > </button>
        </div>
    </div>
</template>
<script>
import apiService from '@/api/apiService';

export default {
    data() {
        return {
            payData: [],
            selectedStartYearMonth: 2024,
            selectedStartMonth: 11,
            selectedEndYearMonth: 2024,
            selectedEndMonth: 11,
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            years: [2022, 2023, 2024, 2025],
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            formattedMonth: '',
            deductionsTotal: 0,

        };
    },

    methods: {
        async fetchPayData() {
            const startYearMonth = `${this.selectedStartYearMonth}-${String(this.selectedStartMonth).padStart(2, '0')}`;
            const endYearMonth = `${this.selectedEndYearMonth}-${String(this.selectedEndMonth).padStart(2, '0')}`;
            try {
                const response = await apiService.getMyPayList(startYearMonth, endYearMonth, this.currentPage);

                this.payData = response.data.data.items.flat().map(item => {

                    const formattedMonth = item.month.split('T')[0].slice(0, 7);

                    const parseNumber = (value) => {
                        return Number(value.replace(/,/g, '')) || 0;
                    };

                    const baseSalary = parseNumber(item.baseSalary);
                    const overtimePay = parseNumber(item.overtimePay);
                    const bonus = parseNumber(item.bonus);
                    const incomeTax = parseNumber(item.incomeTax);
                    const nationalPension = parseNumber(item.nationalPension);
                    const healthInsurance = parseNumber(item.healthInsurance);
                    const employmentInsurance = parseNumber(item.employmentInsurance);
                    const localIncomeTax = parseNumber(item.localIncomeTax);

                    const deductionsTotal = (incomeTax + nationalPension + healthInsurance + employmentInsurance + localIncomeTax).toLocaleString();
                    const totalAmount = baseSalary + overtimePay + bonus - deductionsTotal;

                    return {
                        ...item,
                        formattedMonth,
                        deductionsTotal,
                        totalAmount
                    };
                });

                this.totalElements = response.data.data.totalElements;
                this.totalPages = response.data.data.totalPages;
            } catch (error) {
                console.error('급여 목록을 불러오는 데 실패했습니다.', error);
            }
        },
        formatDate(dateStr) {
            const parts = dateStr.split('T')[0].split('-');
            return `${parts[0]}-${parts[1].padStart(2, '0')}`;
        },

        handlePageChange(page) {
            if (page >= 0 && page < this.totalPages) {
                this.currentPage = page;
                this.fetchPayData();
            }
        },
    },

    mounted() {
        this.fetchPayData();
    },
};
</script>
<style>
.pay-list {
    padding-top: 70px;
    width: 1180px;
    margin-left: 140px;
    height: calc(100vh - 50px);
    overflow-y: auto;
}

.pay-list::-webkit-scrollbar {
    display: none;
}

.pay-list {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

/* 테이블 스타일 */
.table-container {
    overflow-x: auto;
}

.table-container::-webkit-scrollbar {
    display: none;
}

.table-container {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

th,
td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
}

.ellipsis {
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

th {
    background-color: #f4f4f4;
    font-weight: bold;
}

.filter-select {
    padding: 8px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #ffffff;
    color: #333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    margin-right: 10px;
}

.filter-select:focus {
    border-color: #3f72af;
    box-shadow: 0 0 4px rgba(63, 114, 175, 0.5);
    outline: none;
}
</style>