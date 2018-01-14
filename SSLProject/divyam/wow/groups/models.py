from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

import misaka

from django.contrib.auth import get_user_model
User = get_user_model()

from django import template
register = template.Library()

class Group(models.Model):
    name = models.CharField(max_length=250, unique=True)
    slug = models.SlugField(allow_unicode=True, unique=True)
    description = models.TextFieldField(blank=True, default='')
    description_html = models.TextField(editable=False, default='', blank=True)
    members = models.ManyToManyField(User, through='GroupMember')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        self.description_html = misaka.html(self.description)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('groups:single', kwargs={'slug':self.slug})

    class Meta:
        ordering = ['name']


class GroupMember(models.Model):
    group = models.ForiegnKey(Group, related_name='memberships')
    user = models.ForiegnKey(User, related_name='user_groups')

    def __str__(self):
        return self.user.username

    class Meta:
        unique_together = ('group', 'user')


"""class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    education1 = models.TextField(max_length=500, blank=True)
    education2 = models.TextField(max_length=500, blank=True)
    education3 = models.TextField(max_length=500, blank=True)
    publication1 = models.TextField(max_length=500, blank=True)
    publication2 = models.TextField(max_length=500, blank=True)
    publication3 = models.TextField(max_length=500, blank=True)
    Room = models.CharField(max_length=30, blank=True)
    Email = models.CharField(max_length=30, blank=True)
    Phone = models.IntegerField(blank=True)

    def __str__(self):
        return self.user

    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    @receiver(post_save, sender=User)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()"""