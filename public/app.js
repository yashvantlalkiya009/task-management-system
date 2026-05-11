const API = 'http://127.0.0.1:8000/api/tasks';

const AJAX_HEADERS = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
};

let taskModal, deleteModal, viewTaskModal,toastEl;
let pendingDeleteId = null;
let currentPage = 1;

$(document).ready(function () {

    taskModal   = new bootstrap.Modal('#taskModal');
    deleteModal = new bootstrap.Modal('#deleteModal');
    toastEl     = new bootstrap.Toast('#toastMsg', { delay: 2500 });
    viewTaskModal = new bootstrap.Modal('#viewTaskModal');


    loadTasks();

    $('#filterSelect').on('change', function () {
        loadTasks(1);
    });

    $('#searchInput').on('keyup', function () {
        loadTasks(1);
    });

    $('#confirmDeleteBtn').on('click', function () {

        if (pendingDeleteId !== null) {
            deleteTask(pendingDeleteId);
        }
    });

    $('#taskModal').on('hidden.bs.modal', function () {

        $('#taskTitle').removeClass('is-invalid');
        $('#titleError').text('Title is required.');
    });
});

function loadTasks(page = 1)
{
    currentPage = page;

    showSpinner(true);

    const filter = $('#filterSelect').val();
    const search = $('#searchInput').val();

    $.ajax({

        url: `${API}?page=${page}&filter=${filter}&search=${search}`,
        method: 'GET',

        success: function (response) {

            renderTable(response.data);
            renderPagination(response.meta);

            updateStats();

            showSpinner(false);
        },

        error: function () {

            showSpinner(false);

            showToast('Failed to load tasks', 'danger');
        }
    });
}

function renderPagination(meta)
{
    let html = '';

    // Previous Button
    html += `
        <li class="page-item ${meta.current_page === 1 ? 'disabled' : ''}">
            <a class="page-link border-0 shadow-sm"
               href="javascript:void(0)"
               onclick="loadTasks(${meta.current_page - 1})">
               <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;

    // Page Numbers
    for (let i = 1; i <= meta.last_page; i++) {

        html += `
            <li class="page-item ${meta.current_page === i ? 'active' : ''}">
                <a class="page-link border-0 shadow-sm"
                   href="javascript:void(0)"
                   onclick="loadTasks(${i})">
                    ${i}
                </a>
            </li>
        `;
    }

    // Next Button
    html += `
        <li class="page-item ${meta.current_page === meta.last_page ? 'disabled' : ''}">
            <a class="page-link border-0 shadow-sm"
               href="javascript:void(0)"
               onclick="loadTasks(${meta.current_page + 1})">
               <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;

    $('#paginationLinks').html(html);

    // Pagination Info
    $('#paginationInfo').text(
        `Showing ${meta.from ?? 0} to ${meta.to ?? 0} of ${meta.total} tasks`
    );
}

function renderTable(tasks)
{
    const tbody = $('#taskTableBody');

    if (!tasks || tasks.length === 0) {

        tbody.html(`
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i class="bi bi-clipboard-x"></i>
                        No tasks found
                    </div>
                </td>
            </tr>
        `);

        return;
    }

    let rows = '';

    tasks.forEach(function (task) {

        const done       = task.is_completed;
        const rowClass   = done ? 'completed-row' : '';
        const titleClass = done ? 'task-title-done' : '';

        const badgeHtml = done
            ? '<span class="badge badge-done">Completed</span>'
            : '<span class="badge badge-pending">Pending</span>';

        // Description limit 100 chars
        let shortDesc = task.description || '';

        if (shortDesc.length > 100) {
            shortDesc = shortDesc.substring(0, 100) + '...';
        }

        rows += `
            <tr class="${rowClass}">

                <td>
                    <input
                        type="checkbox"
                        class="form-check-input"
                        ${done ? 'checked' : ''}
                        onchange="toggleTask(${task.id}, ${done})"
                    />
                </td>

                <td>
                    <span class="${titleClass} fw-semibold">
                        ${escapeHtml(task.title)}
                    </span>
                </td>

                <td class="text-muted small">
                    ${escapeHtml(shortDesc)}
                </td>

                <td>
                    ${badgeHtml}
                </td>

                <td class="text-muted small">
                    ${formatDate(task.created_at)}
                </td>

                <td class="text-center">

				    <div class="d-flex justify-content-center gap-1">

				        <!-- View -->
				        <button
				            class="btn btn-sm btn-dark d-flex align-items-center justify-content-center"
				            style="width:34px;height:34px;border-radius:10px;"
				            onclick="showTaskView(${task.id})"
				            title="View">

				            <i class="bi bi-eye"></i>

				        </button>

				        <!-- Edit -->
				        <button
				            class="btn btn-sm btn-primary d-flex align-items-center justify-content-center"
				            style="width:34px;height:34px;border-radius:10px;"
				            onclick="openEditModal(${task.id})"
				            title="Edit">

				            <i class="bi bi-pencil"></i>

				        </button>

				        <!-- Delete -->
				        <button
				            class="btn btn-sm btn-danger d-flex align-items-center justify-content-center"
				            style="width:34px;height:34px;border-radius:10px;"
				            onclick="confirmDelete(${task.id})"
				            title="Delete">

				            <i class="bi bi-trash"></i>

				        </button>

				    </div>

				</td>

            </tr>
        `;
    });

    tbody.html(rows);
}

function updateStats()
{
    $.get(API, function (response) {

        const all = response.data;

        const done = all.filter(t => t.is_completed).length;

        const pending = all.length - done;

        $('#statTotal').text(all.length);
        $('#statPending').text(pending);
        $('#statDone').text(done);
    });
}

function openAddModal()
{
    $('#modalTitle').text('Add New Task');

    $('#taskId').val('');
    $('#taskTitle').val('');
    $('#taskDesc').val('');

    taskModal.show();
}

function openEditModal(id)
{
    $.ajax({

        url: `${API}/${id}`,
        method: 'GET',

        success: function (response) {

            const task = response.data;

            $('#modalTitle').text('Edit Task');

            $('#taskId').val(task.id);

            $('#taskTitle').val(task.title);

            $('#taskDesc').val(
                task.description || ''
            );

            taskModal.show();
        },

        error: function () {

            showToast(
                'Failed to load task',
                'danger'
            );
        }
    });
}

function saveTask()
{
    const id    = $('#taskId').val();
    const title = $('#taskTitle').val().trim();
    const desc  = $('#taskDesc').val().trim();

    if (!title) {

        $('#taskTitle').addClass('is-invalid');

        return;
    }

    const payload = {
        title: title,
        description: desc
    };

    const method = id ? 'PUT' : 'POST';

    const url = id
        ? `${API}/${id}`
        : API;

    $.ajax({

        url: url,
        method: method,
        contentType: 'application/json',
        headers: AJAX_HEADERS,
        data: JSON.stringify(payload),

        success: function () {

            taskModal.hide();

            loadTasks(currentPage);

            showToast(
                id
                    ? 'Task updated successfully!'
                    : 'Task created successfully!',
                'success'
            );
        },

        error: function () {

            showToast('Something went wrong', 'danger');
        }
    });
}

function toggleTask(id, currentStatus)
{
    $.ajax({

        url: `${API}/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        headers: AJAX_HEADERS,

        data: JSON.stringify({
            is_completed: !currentStatus
        }),

        success: function () {

            loadTasks(currentPage);

            showToast('Task updated!', 'success');
        },

        error: function () {

            showToast('Failed to update task', 'danger');
        }
    });
}

function confirmDelete(id)
{
    pendingDeleteId = id;

    deleteModal.show();
}

function deleteTask(id)
{
    $.ajax({

        url: `${API}/${id}`,
        method: 'DELETE',
        headers: AJAX_HEADERS,

        success: function () {

            deleteModal.hide();

            loadTasks(currentPage);

            showToast('Task deleted!', 'secondary');
        },

        error: function () {

            showToast('Delete failed', 'danger');
        }
    });
}

function showSpinner(visible)
{
    $('#loadingSpinner').css(
        'display',
        visible ? 'inline-block' : 'none'
    );
}

function showTaskView(id)
{
    $.ajax({

        url: `${API}/${id}`,
        method: 'GET',

        success: function (response) {

            const task = response.data;

            $('#viewTaskTitle').text(task.title);

            $('#viewTaskDesc').text(
                task.description || 'No description'
            );

            $('#viewTaskCreated').text(
                formatDate(task.created_at)
            );

            $('#viewTaskStatus').html(
                task.is_completed
                    ? '<span class="badge badge-done">Completed</span>'
                    : '<span class="badge badge-pending">Pending</span>'
            );

            viewTaskModal.show();
        },

        error: function () {

            showToast(
                'Failed to load task details',
                'danger'
            );
        }
    });
}

function showToast(message, type = 'success')
{
    const colors = {
        success: '#198754',
        danger: '#dc3545',
        secondary: '#6c757d',
        warning: '#ffc107',
    };

    $('#toastMsg').css(
        'background-color',
        colors[type] || colors.success
    );

    $('#toastBody').text(message);

    toastEl.show();
}

function escapeHtml(str)
{
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeAttr(str)
{
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDate(dateStr)
{
    if (!dateStr) return '—';

    const d = new Date(dateStr);

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}