<!-- eslint-disable vue/no-parsing-error -->
<template>
    <div class="leave-list">
        <h2>휴가 리스트</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>이름</th>
                        <th>휴가 종류</th>
                        <th>사용기간</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="leave in leaves" :key="leave.leaveId">
                        <td>{{ leave.leaveId }}</td>
                        <td>{{ leave.username }}</td>
                        <td>
                            <span :class="getLeaveTypeClass(leave.leaveType)">{{ leave.leaveType }}</span>
                        </td>
                        <td>{{ leave.date }}</td>
                        <td :class="getStatusClass(leave.status)">{{ leave.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
            <button class="pagination-arrow" :disabled="currentPage === 0" @click="handlePageChange(currentPage - 1)">
                < </button>

                    <!-- 페이지 번호들 반복 출력 -->
                    <span v-for="page in totalPages" :key="page" :class="{
                        'pagination-page': true,   // 기본 스타일
                        'active': page === currentPage + 1   // 현재 페이지에 active 클래스 추가
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
import apiService from '@/api/apiService'

export default {
    data() {
        return {
            currentPage: 0,
            pageSize: 10,
            totalElements: 0,
            totalPages: 0,
            leaves: []
        };
    },
    methods: {
        async fetchLeaves() {
            try {
                const response = await apiService.fetchLeaveList(
                    this.currentPage,
                    this.pageSize
                );

                this.leaves = [...response.data.data.items];

                this.totalElements = response.data.data.totalElements;
                this.totalPages = response.data.data.totalPages;
                this.$nextTick(() => {
                    console.log('DOM updated after fetching new leaves');
                });
            } catch (error) {
                console.error('휴가 목록을 불러오는 데 실패했습니다.', error);
            }
        },
        handlePageChange(page) {
            if (page >= 0 && page < this.totalPages) {
                this.currentPage = page;
                this.fetchLeaves();
            }
        },
        getStatusClass(status) {
            switch (status) {
                case '거절':
                    return 'rejected';
                case '대기':
                    return 'pending';
                case '승인':
                    return 'approved';
                default:
                    return '';
            }
        },
        getLeaveTypeClass(leaveType) {
            const blueTypes = ['반차', '반반차'];
            const greenTypes = ['여름휴가', '겨울휴가'];
            const grayTypes = ['경조휴가', '병가', '휴무'];
            //기본연차, 반차, 반반차, 여름휴가, 겨울휴가, 경조휴가, 병가, 휴무

            if (blueTypes.includes(leaveType)) {
                return 'blue-leave';
            } else if (greenTypes.includes(leaveType)) {
                return 'green-leave';
            } else if (grayTypes.includes(leaveType)) {
                return 'gray-leave';
            } else if (leaveType === '기본연차') {
                return 'black-leave';
            }
            return 'default-leave';
        },
    },
    mounted() {
        this.fetchLeaves();
    }
}
</script>

<style scoped>
.leave-list {
    padding-top: 70px;
    width: 1180px;
    margin-left: 140px;
    height: calc(100vh - 50px);
    overflow-y: auto;
}

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

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
}

.rejected {
    color: red;
}

.pending {
    color: green;
}

.approved {
    color: blue;
}

.blue-leave {
    background-color: #2196f3;
    color: #fff;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 14px;
    display: inline;
    text-align: center;
}

.green-leave {
    background-color: #4caf50;
    color: #fff;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 14px;
    display: inline;
    text-align: center;
}

.gray-leave {
    background-color: #9e9e9e;
    color: #fff;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 14px;
    display: inline;
    text-align: center;
}

.black-leave {
    background-color: #000;
    color: #fff;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 14px;
    display: inline;
    text-align: center;
}

.default-leave {
    background-color: #f5f5f5;
    color: #fff;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 14px;
    display: inline;
    text-align: center;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
}

.pagination span.current-page {
    font-weight: bold;
    text-decoration: underline;
}

.pagination-page {
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    color: #000000;
    transition: color 0.3s ease;
}

.pagination-page:hover {
    color: #1d4f7a;
}

.pagination-page.active {
    color: #3f72af;
    font-weight: bold;
    text-decoration: underline;
}

.pagination-arrow {
    padding: 10px;
    border-radius: 50%;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    color: #3f72af;
    border: 1px solid #3f72af;
    background-color: white;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.pagination-arrow:hover {
    background-color: #3f72af;
    color: white;
}

.pagination-arrow:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>