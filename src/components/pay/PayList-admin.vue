<template>
    <div class="pay-list">
        <h2>급여 지급 현황 목록</h2>
        <div class="header">
            <div class="search-filter-container">
                <input type="text" v-model="searchQuery" placeholder="검색" @input="handleSearch" class="search-input" />

                <!--필터 아이콘-->
                <button @click="toggleFilters" class="jump-button">
                    <i class="fas fa-sliders-h"></i>
                </button>
            </div>
        </div>
        <div v-if="showFilters" class="filters">
            <div class="filter-group">
                <label for="departmentFilter"></label>
                <select id="departmentFilter" v-model="selectedDepartment" @change="fetchPayData" class="filter-select">
                    <option value="">모든 부서</option>
                    <option v-for="department in departments" :key="department" :value="department">{{ department }}
                    </option>
                </select>
            </div>

            <div class="filter-group">
                <label for="statusFilter"></label>
                <select id="statusFilter" v-model="selectedStatus" @change="fetchPayData" class="filter-select">
                    <option value="">모든 상태</option>
                    <option value="paid">지급</option>
                    <option value="unpaid">미지급</option>
                </select>
            </div>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>사원 이름</th>
                        <th>부서</th>
                        <th>지급 일자</th>
                        <th>지급 상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pay in filteredPayData" :key="pay.payId" @click="viewPayDetails(pay)">
                        <td>{{ pay.payId }}</td>
                        <td>{{ pay.department }}</td>
                        <td>{{ pay.username }}</td>
                        <td>{{ pay.bonus }}</td>
                        <td>
                            <span :class="pay.paymentStatus ? 'paid' : 'unpaid'">
                                {{ pay.paymentStatus ? '지급' : '미지급' }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <PayDetailModal v-if="showPayDetailModal" :payDetails="seletedPay" @close="closeDetailModal" />
        </div>
        <div class="pagination">
            <button class="pagination-arrow" :disabled="currentPage === 0" @click="handlePageChange(currentPage - 1)">
                 </button>
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
import PayDetailModal from '../pay/PayDetailModal.vue';

export default {
    components: {
        PayDetailModal,
    },
    data() {
        return {
            payData: [],
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            selectedDepartment: '',
            selectedStatus: '',
            departments: ['영업1팀', '영업2팀', '영업3팀', '인사1팀', '인사2팀', '인사3팀', '생산1팀', '생산2팀', '생산3팀'], // 부서 목록
            showFilters: false,
            showPayDetailModal: false,
        };
    },
    computed: {
        // 필터링된 데이터
        filteredPayData() {
            let filteredData = this.payData;

            // 검색 필터
            if (this.searchQuery) {
                filteredData = filteredData.filter(pay =>
                    pay.username.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            if (this.selectedDepartment) {
                filteredData = filteredData.filter(pay => pay.department === this.selectedDepartment);
            }

            if (this.selectedStatus) {
                const status = this.selectedStatus === 'paid' ? true : false;
                filteredData = filteredData.filter(pay => pay.paymentStatus === status);
            }

            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.totalElements = filteredData.length;
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.totalPages = Math.ceil(this.totalElements / 10);
            return filteredData.slice(this.currentPage * 10, (this.currentPage + 1) * 10); // 페이지 크기 10
        }
    },
    methods: {
        async openPayDetailModal(payId) {
            const pay = this.payData.find(item => item.payId === payId);
            this.payDetail = pay;
            this.showPayDetailModal = true;
        },
        toggleFilters() {
            this.showFilters = !this.showFilters
        },
        async fetchPayData() {
            try {

                const response = await apiService.getPayList();
                this.payData = response.data.data.items.flat();

                this.totalElements = response.data.data.totalElements;
                this.totalPages = response.data.data.totalPages;
            } catch (error) {
                console.error('급여 목록을 불러오는데 실패했습니다.', error);
            }
        },
        async viewPayDetails(pay) {
            try {
                const response = await apiService.fetchPayDetails(pay.payId);
                console.log(response);
                this.seletedPay = response.data.data;
                this.showPayDetailModal = true;
            } catch (error) {
                console.error('급여 세부 정보를 불러오는 데 실패했습니다', error);
            }
        },
        handlePageChange(page) {
            this.currentPage = page;
        },
        handleSearch() {
            this.currentPage = 1
            this.fetchCustomers()
        },
        closeDetailModal() {
            this.showPayDetailModal = false;
        }
    },
    mounted() {
        this.fetchPayData();
    }
}
</script>
<style scoped>
.pay-list {
    padding-top: 70px;
    width: 1180px;
    margin-left: 140px;
    height: calc(100vh - 50px);
    overflow-y: auto;
}

.table-container {
    overflow-x: auto;
    border-collapse: collapse;
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;

}

th,
td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    white-space: nowrap;
    vertical-align: middle;
}

th {
    background-color: #f4f4f4;
    font-weight: bold;
    text-transform: uppercase;
    color: #555;
}

.paid,
.unpaid {
    color: white;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: bold;
    display: inline-block;
    text-align: center;
    line-height: 1;
}

.paid {
    background-color: green;
}

.unpaid {
    background-color: red;
}

.jump-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #3f72af;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.jump-button:hover {
    background-color: #434190;
    transform: translateY(-5px);
}

.jump-button:active {
    transform: translateY(2px);
}

.search-filter-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-input {
    padding: 8px;
    font-size: 16px;
    width: 300px;
}

.filters {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.filter-icon-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
}

.filter-icon-button .fas {
    color: #4caf50;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filter-group label {
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

.filter-select {
    padding: 8px 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #ffffff;
    color: #333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.filter-select:focus {
    border-color: #3f72af;
    box-shadow: 0 0 4px rgba(63, 114, 175, 0.5);
    outline: none;
}

@media (max-width: 768px) {
    .filters {
        flex-direction: column;
        align-items: flex-start;
    }

    .filter-group {
        width: 100%;
    }

    .filter-select {
        width: 100%;
    }
}
</style>