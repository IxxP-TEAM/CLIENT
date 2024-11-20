<template>
    <div class="attendance-list-container">
        <p>근태관리</p>
        <h2>출퇴근 현황</h2>
        <div class="navigation-buttons">
            <button @click="changeMonth('previous')">이전 월</button>
            <div class="date-selector">
                <label for="year"></label>
                <select v-model="selectedYear" @change="fetchAttendanceData">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
                </select>
                <label for="month"></label>
                <select v-model="selectedMonth" @change="fetchAttendanceData">
                    <option v-for="month in months" :key="month" :value="month">{{ month }}월</option>
                </select>
            </div>
            <button @click="changeMonth('next')">다음 월</button>
        </div>

        <table class="attendance-table">
            <colgroup>
                <col style="width: 10%" />
                <col style="width: 20%" />
                <col style="width: 30%" />
                <col style="width: 30%" />
                <col style="width: 20%" />
            </colgroup>
            <thead>
                <tr>
                    <th>번호</th>
                    <th>날짜</th>
                    <th>출근 시간</th>
                    <th>퇴근 시간</th>
                    <th>상태</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(attendance, index) in attendanceData" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ attendance.workDate }}</td>
                    <td>{{ attendance.checkIn || '-' }}</td>
                    <td>{{ attendance.checkOut || '퇴근 전' }}</td>
                    <td>
                        <span :class="{
                            'status-green': attendance.status === '출근',
                            'status-red': attendance.status === '결근',
                            'status-yellow': attendance.status === '지각',
                            'status-gray': attendance.status === '휴가',
                            'status-blue': attendance.status === '근무 중'
                        }">
                            {{ attendance.status }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import apiService from "@/api/apiService";
import VueJwtDecode from "vue-jwt-decode";

export default {
    data() {
        return {
            selectedMonth: 11,
            selectedYear: 2024,
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            years: [2022, 2023, 2024, 2025],
            attendanceData: [],
            userId: null,
        };
    },
    methods: {
        getUserNameFromToken() {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    const decodedToken = VueJwtDecode.decode(token);
                    this.userId = decodedToken.userId || "이름 정보 없음";
                } catch (error) {
                    console.error("토큰 디코딩 오류:", error);
                    this.selectedEmployeeName = "디코딩 실패";
                    this.userId = null;
                }
            } else {
                this.selectedEmployeeName = "로그인 필요";
                this.userId = null;
            }
        },
        async fetchAttendanceData() {
            try {
                const response = await apiService.getMyAttList(this.userId, this.selectedYear, this.selectedMonth);
                const rawData = response.data.data.items;

                this.attendanceData = rawData
                    .map(item => {
                        let status = "출근";
                        let statusClass = "blue";
                        if (item.lateFlag) {
                            status = "지각";
                            statusClass = "yellow";
                        } else if (item.earlyLeaveFlag) {
                            status = "결근";
                            statusClass = "red";
                        } else if (item.checkOut === null && item.checkIn !== null) {
                            status = "근무 중";
                            statusClass = "green";
                        } else {
                            status = "휴가";
                            statusClass = "gray";
                        }

                        return {
                            ...item,
                            status,
                            statusClass
                        };
                    })
                    .sort((a, b) => {
                        const [monthA, dayA] = a.workDate.split('-').map(Number);
                        const [monthB, dayB] = b.workDate.split('-').map(Number);

                        if (monthA === monthB) {
                            return dayA - dayB;
                        }
                        return monthA - monthB;
                    });

                console.log("Processed and Sorted Attendance Data:", this.attendanceData);
            } catch (error) {
                console.error("출퇴근 현황 조회에 실패했습니다.", error);
            }
        },
        changeMonth(direction) {
            if (direction === "previous") {
                if (this.selectedMonth === 1) {
                    this.selectedMonth = 12;
                    this.selectedYear -= 1;
                } else {
                    this.selectedMonth -= 1;
                }
            } else if (direction === "next") {
                if (this.selectedMonth === 12) {
                    this.selectedMonth = 1;
                    this.selectedYear += 1;
                } else {
                    this.selectedMonth += 1;
                }
            }
            this.fetchAttendanceData();
        },
    },
    mounted() {
        this.getUserNameFromToken();
        this.fetchAttendanceData();
    },
};
</script>

<style scoped>
.attendance-list-container {
    padding-top: 70px;
    width: 1180px;
    margin-left: 140px;
    height: calc(100vh - 50px);
    overflow-y: auto;
}

.date-selector {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.date-selector label {
    font-weight: bold;
}

.date-selector select {
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
}

.navigation-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
}

.navigation-buttons button {
    padding: 8px 15px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

.navigation-buttons button:hover {
    background-color: #0056b3;
}

.attendance-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.attendance-table th,
.attendance-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

.attendance-table th {
    background-color: #f1f1f1;
    font-weight: bold;
}

.status-green,
.status-red,
.status-yellow,
.status-blue,
.status-gray {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 8px;
    font-weight: bold;
    color: white;
    font-size: 10px;
}

.status-green {
    background-color: #28a745;
}

.status-red {
    background-color: #dc3545;
}

.status-yellow {
    background-color: #ffc107;
}

.status-blue {
    background-color: #007bff;
}

.status-gray {
    background-color: gray;
}
</style>