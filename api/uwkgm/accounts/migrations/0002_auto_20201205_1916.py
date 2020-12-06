# Generated by Django 3.1.4 on 2020-12-05 10:16

import accounts.models.accounts
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='registration_code',
            field=models.TextField(blank=True, default=accounts.models.accounts.gen_registration_code, max_length=32, null=True, verbose_name='Registration code'),
        ),
    ]
