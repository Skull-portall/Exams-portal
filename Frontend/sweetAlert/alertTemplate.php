<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Redirecting…</title>
    <!-- include SweetAlert2 from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
    <script>
        Swal.fire({
            title: <?= json_encode($alertTitle) ?>,
            text: <?= json_encode($alertText) ?>,
            icon: <?= json_encode($alertIcon) ?>,
            confirmButtonText: <?= json_encode($alertButton) ?>
        }).then((result) => {
            // When user clicks OK, go to the PHP dashboard
            if (result.isConfirmed) {
                window.location.href = <?= json_encode($redirectUrl) ?>;
            }
        });
    </script>
</body>

</html>