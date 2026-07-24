<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('internship_offer_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
            $table->unique(['student_id', 'company_id', 'internship_offer_id']);
        });
    }
    public function down(): void { Schema::dropIfExists('conversations'); }
};