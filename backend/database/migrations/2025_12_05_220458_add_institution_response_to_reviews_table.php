  <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration
    {
        public function up(): void
        {
            Schema::table('reviews', function (Blueprint $table) {
                $table->text('institution_response')->nullable()->after('comment');

                $table->timestamp('responded_at')->nullable()->after('institution_response');
            });
        }

        public function down(): void
        {
            Schema::table('reviews', function (Blueprint $table) {
                $table->dropColumn(['institution_response', 'responded_at']);
            });
        }
    };
